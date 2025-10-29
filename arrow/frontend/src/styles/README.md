# 🎨 Organisation des Styles Arrow

## Structure Simplifiée

```
src/
├── index.css                 # Point d'entrée UNIQUE - Tous les styles globaux centralisés
└── components/ui/            # Composants avec leurs styles
    ├── button.tsx
    ├── button.module.css
    ├── card.tsx
    ├── card.module.css
    └── ...
```

**Tous les styles globaux sont centralisés dans `index.css` pour éviter les doublons et assurer la cohérence.**

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

### ✅ Utiliser index.css pour :
- Variables CSS globales (`:root`)
- Reset CSS et styles de base (`body`)
- Background vaporwave global
- Classes utilitaires réutilisables (`.text-vaporwave`, `.text-glow`, etc.)

## Structure de index.css

### Variables CSS (`:root`)
- Couleurs de base et composants
- Couleurs primaires Vaporwave
- États (muted, accent, destructive)
- Bordures et inputs
- Border radius
- Couleurs Vaporwave personnalisées

### Reset et Base
- Reset CSS (`*`)
- Styles du `body`
- Background vaporwave (gradient + grille)
- Animations globales (`@keyframes`)

### Classes Utilitaires
- `.text-vaporwave` - Texte avec gradient bleu
- `.text-glow` - Effet glow néon
- `.border-vaporwave` - Bordures avec gradient
- `.box-glow` - Ombre lumineuse
- `.content-wrapper` - Z-index pour contenu
- `.animate-glow-pulse` - Animation pulsation

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
// Import CSS Module pour styles spécifiques
import styles from './ComponentName.module.css';

// Les classes utilitaires de index.css sont disponibles globalement
function Component() {
  return (
    <div className={`flex flex-col gap-4 ${styles.customStyle} text-vaporwave`}>
      {/* Tailwind pour layout, CSS Module pour styles spécifiques, classes globales pour effets */}
    </div>
  );
}
```

## Maintenance

1. **Ajouter une nouvelle couleur** → `index.css` dans `:root`
2. **Modifier le background** → `index.css` dans `body::before/after`
3. **Nouvel effet réutilisable** → `index.css` dans `@layer utilities`
4. **Style spécifique à un composant** → Créer `.module.css` associé
5. **Style spécifique à un layout** → Créer `LayoutName.module.css` dans le dossier layouts

---

*Design System: Vaporwave Sky Blue* 🌊✨
*Structure simplifiée pour éviter les doublons et incohérences*