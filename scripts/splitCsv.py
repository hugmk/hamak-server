import csv

# Spécifiez le chemin d'accès au fichier CSV source et destination
fichier_source = '../french_products.csv'
fichier_destination = '../french_products_ten.csv'

# Ouvrez le fichier source en mode lecture
with open(fichier_source, 'r', encoding='utf-8') as source:
    lecteur_csv = csv.reader(source)

    # Ouvrez le fichier destination en mode écriture
    with open(fichier_destination, 'w', newline='', encoding='utf-8') as destination:
        ecrivain_csv = csv.writer(destination)

        # Bouclez à travers les lignes du fichier source jusqu'à atteindre la ligne 10000
        for i, ligne in enumerate(lecteur_csv):
            if i == 10:
                break
            ecrivain_csv.writerow(ligne)
