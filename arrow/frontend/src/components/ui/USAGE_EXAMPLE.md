# 📘 Exemples d'utilisation des styles

## Import des CSS Modules

```tsx
// Dans votre composant
import styles from './button.module.css';
import cardStyles from './card.module.css';
```

## Bouton avec CSS Module

```tsx
import styles from './button.module.css';

function MyButton() {
  return (
    <button className={`${styles.btn} px-6 py-3`}>
      Cliquer ici
    </button>
  );
}
```

## Card avec combinaison Tailwind + CSS Module

```tsx
import cardStyles from './card.module.css';

function StatsCard() {
  return (
    <div className={`${cardStyles.statCard} flex flex-col gap-4`}>
      <h3 className="text-vaporwave text-2xl font-bold">92%</h3>
      <p className="text-gray-400">Satisfaction</p>
    </div>
  );
}
```

## Input avec focus effect

```tsx
import inputStyles from './input.module.css';

function SearchInput() {
  return (
    <div className="relative w-full">
      <input 
        type="text"
        className={`${inputStyles.input} w-full pl-12`}
        placeholder="Rechercher..."
      />
    </div>
  );
}
```

## Badge dynamique

```tsx
import badgeStyles from './badge.module.css';

function StatusBadge({ status }: { status: 'success' | 'warning' | 'error' }) {
  const badgeClass = {
    success: badgeStyles.badgeSuccess,
    warning: badgeStyles.badgeWarning,
    error: badgeStyles.badgeError,
  }[status];

  return (
    <span className={`${badgeStyles.badge} ${badgeClass}`}>
      {status}
    </span>
  );
}
```

## Progress Bar

```tsx
import progressStyles from './progress.module.css';

function ProgressBar({ value }: { value: number }) {
  return (
    <div className={progressStyles.progressBarBg}>
      <div 
        className={progressStyles.progressBar}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
```

## Classes utilitaires (from effects.css)

```tsx
function Hero() {
  return (
    <div className="content-wrapper">
      <h1 className="text-vaporwave text-glow text-5xl font-black">
        DASHBOARD ADMIN
      </h1>
      <div className="box-glow p-6 mt-4">
        <p>Contenu avec glow effect</p>
      </div>
    </div>
  );
}
```

## Action Card avec hover

```tsx
import cardStyles from './card.module.css';
import { useNavigate } from 'react-router-dom';

function ActionCard() {
  const navigate = useNavigate();
  
  return (
    <div 
      className={`${cardStyles.actionCard} cursor-pointer`}
      onClick={() => navigate('/admin/cohortes')}
    >
      <h3 className="text-[#87ceeb] font-bold uppercase">Cohortes</h3>
      <p className="text-gray-400 text-sm">Gérer les groupes</p>
    </div>
  );
}
```

## Navbar avec avatar

```tsx
import navbarStyles from './navbar.module.css';

function Navbar() {
  return (
    <nav className={navbarStyles.navbar}>
      <div className="flex justify-between items-center">
        <h1 className="text-vaporwave text-2xl font-bold">ARROW</h1>
        <div className={navbarStyles.avatar}>
          JD
        </div>
      </div>
    </nav>
  );
}
```

## Responsive avec Tailwind + CSS Modules

```tsx
import cardStyles from './card.module.css';

function ResponsiveCard() {
  return (
    <div className={`
      ${cardStyles.card}
      w-full
      md:w-1/2
      lg:w-1/3
      p-4
      md:p-6
      lg:p-8
    `}>
      {/* Contenu responsive */}
    </div>
  );
}
```

## Tips

1. **Toujours combiner** : Tailwind pour layout, CSS Modules pour effets
2. **Classes utilitaires** : Utilisez `.text-vaporwave`, `.text-glow`, etc. pour les effets réutilisables
3. **Performance** : Les CSS Modules sont automatiquement scopés et optimisés
4. **Maintenance** : Un composant = un fichier `.module.css` associé


