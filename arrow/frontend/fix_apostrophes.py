#!/usr/bin/env python3
import re

# Lire le fichier
with open('src/components/ui/CollapsibleBreadcrumb.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remplacer tous les types d'apostrophes Unicode par des apostrophes ASCII simples
fixed = re.sub(r'[\u2018\u2019\u201A\u201B\u2032\u2035]', "'", content)

# Écrire le fichier corrigé
with open('src/components/ui/CollapsibleBreadcrumb.tsx', 'w', encoding='utf-8') as f:
    f.write(fixed)

print('Fixed apostrophes in CollapsibleBreadcrumb.tsx')

