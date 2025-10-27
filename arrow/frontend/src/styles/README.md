# 🎨 Organisation des Styles Arrow

## Structure

```
src/
├── styles/               # Styles globaux
│   ├── theme.css        # Variables CSS (couleurs, espacements)
│   ├── base.css         # Reset, body, backgrounds
│   ├── effects.css      # Effets visuels réutilisables
│   └── README.md        # Ce fichier
│
├── components/ui/        # Composants avec leurs styles
│   ├── button.tsx
│   ├── button.module.css
│   ├── card.tsx
│   ├── card.module.css
│   └── ...
│
└── index.css            # Point d'entrée (imports uniquement)
```

## Philosophie

### ✅ Utiliser Tailwind pour :
- Layout (flex, grid, spacing)
- Responsive design (md:, lg:, etc.)
- Typography de base (text-sm, font-bold)
- Positionnement (absolute, relative, z-index)

### ✅ Utiliser CSS Modules pour :
- Effets visuels complexes (gradients, shadows, glows)
- Animations spécifiques aux composants
- Styles hover/focus élaborés
- Bordures néon et effects vaporwave

## Fichiers

### `theme.css`
Variables CSS globales :
- Couleurs (HSL et hex)
- Espacements
- Border radius
- Couleurs Vaporwave personnalisées

### `base.css`
Styles de base :
- Reset CSS
- Styles du body
- Background vaporwave (gradient + grille)
- Animations globales

### `effects.css`
Classes utilitaires pour effets :
- `.text-vaporwave` - Texte avec gradient bleu
- `.text-glow` - Effet glow néon
- `.border-vaporwave` - Bordures avec gradient
- `.box-glow` - Ombre lumineuse
- `.content-wrapper` - Z-index pour contenu

## Composants

Chaque composant UI a son fichier `.module.css` :
- `button.module.css` - Boutons avec gradient
- `card.module.css` - Cartes et cards variants
- `input.module.css` - Inputs avec borders néon
- `badge.module.css` - Badges (success, warning, error)
- `progress.module.css` - Barres de progression rétro
- `navbar.module.css` - Navigation et avatar

## Import dans les composants

```tsx
import styles from './ComponentName.module.css';

function Component() {
  return (
    <div className={styles.componentClass}>
      {/* Contenu */}
    </div>
  );
}
```

## Combinaison Tailwind + CSS Modules

```tsx
import styles from './card.module.css';

function Card() {
  return (
    <div className={`flex flex-col gap-4 p-6 ${styles.card}`}>
      {/* Tailwind pour layout, CSS Module pour effets */}
    </div>
  );
}
```

## Performance

- Tailwind purge activé → Classes inutilisées supprimées en production
- CSS Modules → Scoped styles, pas de conflits
- Imports organisés → Chargement optimisé

## Maintenance

1. **Ajouter une nouvelle couleur** → `theme.css`
2. **Modifier le background** → `base.css`
3. **Nouvel effet réutilisable** → `effects.css`
4. **Style spécifique à un composant** → Créer `.module.css` associé

---

*Design System: Vaporwave Sky Blue* 🌊✨

