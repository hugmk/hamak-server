import csv

# Spécifier le chemin d'accès au fichier CSV source et destination
fichier_source = '../en.openfoodfacts.org.products.csv'
fichier_destination = '../french_products.openfoodfacts.csv'

colonnes = ['product_name', 'code', 'brands', 'image_url', 'quantity', 'main_category', 'categories', 'labels', 'ingredients_text', 'allergens', 'traces_tags', 'additives_tags', 'nutriscore_score', 'nutriscore_grade', 'ecoscore_score', 'ecoscore_grade', 'nova_group', 'nutrient_levels_tags', 'energy-kcal_100g', 'fat_100g', 'saturated-fat_100g', 'carbohydrates_100g', 'sugars_100g', 'fiber_100g', 'proteins_100g', 'salt_100g', 'sodium_100g']

with open(fichier_source, 'r', encoding='utf-8') as input_file, open(fichier_destination, 'w', newline='', encoding='utf-8') as output_file:
    # Créer un lecteur CSV pour lire le fichier d'entrée
    lecteur_csv = csv.DictReader(input_file, delimiter='\t')

    # Créer un écrivain CSV pour écrire le fichier de sortie
    ecrivain_csv = csv.DictWriter(output_file, fieldnames=colonnes)

    # Écrire l'en-tête du fichier de sortie
    ecrivain_csv.writeheader()

    # Parcourir les lignes du fichier d'entrée et écrire les lignes correspondantes dans le fichier de sortie
    for ligne in lecteur_csv:
        # Vérifier si le pays est "France" (ou "france") et que le champ 'product_name' n'est pas vide
        if 'france' in ligne['countries'].lower() and ligne['product_name'] != '':
            # Écrire les colonnes sélectionnées dans le fichier de sortie
            nouvelle_ligne = {}
            for colonne in colonnes:
                # Ajouter la valeur à la nouvelle ligne seulement si elle n'est pas vide
                if ligne[colonne] is not None:
                    nouvelle_ligne[colonne] = ligne[colonne]
                else:
                    nouvelle_ligne[colonne] = ''

            ecrivain_csv.writerow(nouvelle_ligne)
