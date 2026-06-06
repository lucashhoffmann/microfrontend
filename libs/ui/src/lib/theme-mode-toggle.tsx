import {
  Check,
  LaptopMinimal,
  MoonStar,
  Palette,
  SunMedium,
} from 'lucide-react';
import { useState } from 'react';
import { ColorTheme, ThemeMode } from '@modular-payments-console/contracts';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { cn } from './utils';
import { useTheme } from './theme-provider';

const themeIcons: Record<ThemeMode, typeof SunMedium> = {
  light: SunMedium,
  dark: MoonStar,
  system: LaptopMinimal,
};

const themeLabels: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const themeDescriptions: Record<ThemeMode, string> = {
  light: 'Clear contrast for daytime operations.',
  dark: 'Comfortable for focused, low-light work.',
  system: 'Follows the operating system preference.',
};

const colorThemeOptions: Array<{
  value: ColorTheme;
  label: string;
  swatchClassName: string;
}> = [
  {
    value: 'default',
    label: 'Default',
    swatchClassName: 'bg-zinc-700 dark:bg-zinc-300',
  },
  {
    value: 'violet',
    label: 'Violet',
    swatchClassName: 'bg-violet-600 dark:bg-violet-400',
  },
  {
    value: 'red',
    label: 'Red',
    swatchClassName: 'bg-red-600 dark:bg-red-400',
  },
  {
    value: 'green',
    label: 'Green',
    swatchClassName: 'bg-emerald-600 dark:bg-emerald-400',
  },
  {
    value: 'blue',
    label: 'Blue',
    swatchClassName: 'bg-blue-600 dark:bg-blue-400',
  },
];

const activeColorSwatchClassName: Record<ColorTheme, string> = {
  default: 'bg-zinc-700 dark:bg-zinc-300',
  violet: 'bg-violet-600 dark:bg-violet-400',
  red: 'bg-red-600 dark:bg-red-400',
  green: 'bg-emerald-600 dark:bg-emerald-400',
  blue: 'bg-blue-600 dark:bg-blue-400',
};

function ThemeIcon({
  theme,
  className,
}: {
  theme: ThemeMode;
  className?: string;
}) {
  const Icon = themeIcons[theme];
  return <Icon className={className} />;
}

function ThemeSelectorDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { colorTheme, setColorTheme, theme, setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-4 sm:max-w-md">
        <DialogHeader className="border-b border-border/70 px-1 pb-4">
          <DialogTitle>Appearance preferences</DialogTitle>
          <DialogDescription>
            Choose the theme mode and the primary color shared across shell and
            remotes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-1 pb-1">
          <div className="space-y-3">
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Appearance teste
            </p>

            <div className="space-y-2">
              {(Object.keys(themeIcons) as ThemeMode[]).map((option) => {
                const Icon = themeIcons[option];
                const isActive = theme === option;

                return (
                  <Button
                    key={option}
                    type="button"
                    variant={isActive ? 'secondary' : 'outline'}
                    className={cn(
                      'h-auto w-full justify-start gap-3 px-4 py-3 text-left',
                      isActive &&
                        'border-primary/25 bg-primary/8 text-foreground hover:bg-primary/10',
                    )}
                    onClick={() => setTheme(option)}
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {themeLabels[option]}
                      </p>
                      <p className="text-xs leading-5 text-muted-foreground">
                        {themeDescriptions[option]}
                      </p>
                    </div>
                    {isActive ? (
                      <Check className="size-4 text-primary" />
                    ) : null}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 border-t border-border/70 pt-5">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Primary color
            </p>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {colorThemeOptions.map((option) => {
                const isActive = colorTheme === option.value;

                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={isActive ? 'secondary' : 'outline'}
                    className={cn(
                      'h-auto justify-start gap-2 px-4 py-3',
                      isActive &&
                        'border-primary/25 bg-primary/8 text-foreground hover:bg-primary/10',
                    )}
                    onClick={() => setColorTheme(option.value)}
                  >
                    <span
                      className={cn(
                        'size-4 rounded-full border border-black/10 dark:border-white/10',
                        option.swatchClassName,
                      )}
                    />
                    <span className="text-sm">{option.label}</span>
                    {isActive ? (
                      <Check className="ml-auto size-3.5 text-primary" />
                    ) : null}{' '}
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Palette className="size-3.5" />
              The selected accent is propagated to every federated surface.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ThemeModeToggle() {
  const { colorTheme, theme } = useTheme();
  const currentThemeLabel = themeLabels[theme];

  return (
    <ThemeSelectorDialog
      trigger={
        <Button
          variant="outline"
          size="icon"
          aria-label={`Current theme: ${currentThemeLabel}. Open theme preferences`}
          className="relative rounded-md border-border/70 bg-background/80"
        >
          <ThemeIcon theme={theme} className="size-[1.05rem]" />
          <span
            className={cn(
              activeColorSwatchClassName[colorTheme],
              'absolute right-1.5 bottom-1.5 size-2 rounded-full border border-white/80 dark:border-zinc-950/80',
            )}
          />
        </Button>
      }
    />
  );
}
