import csv
import json
from collections import defaultdict

# Read CSV file
champions_data = []
with open('set16/3rd Party Cheat Sheet - TFT Lore & Legends - Champs & Associated Traits + Abilities.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        champions_data.append(row)

# Process champions and extract traits
traits_map = defaultdict(list)
champions_list = []

for champ in champions_data:
    name = champ['Champion'].strip()
    cost = champ['Cost'].replace('g', '').strip()

    # Skip empty rows
    if not name:
        continue

    # Get traits
    traits = []
    for i in range(1, 4):
        trait = champ.get(f'Trait {i}', '').strip()
        if trait:
            traits.append(trait)
            traits_map[trait].append(name)

    champion_info = {
        'name': name,
        'cost': int(cost) if cost.isdigit() else 1,
        'traits': traits
    }
    champions_list.append(champion_info)

# Save champions data
with open('set16_champions.json', 'w', encoding='utf-8') as f:
    json.dump(champions_list, f, indent=2, ensure_ascii=False)

# Save traits data
traits_list = []
for trait_name, champs in sorted(traits_map.items()):
    traits_list.append({
        'name': trait_name,
        'champions': sorted(champs)
    })

with open('set16_traits.json', 'w', encoding='utf-8') as f:
    json.dump(traits_list, f, indent=2, ensure_ascii=False)

print(f"Processed {len(champions_list)} champions")
print(f"Found {len(traits_list)} traits")
print("\nTraits:")
for trait in traits_list:
    print(f"  - {trait['name']}: {len(trait['champions'])} champions")

