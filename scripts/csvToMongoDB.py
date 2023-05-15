import csv
import pymongo
import json
import datetime

start_time = datetime.datetime.now()

# Connexion à la base de données MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["hamakdb"]
collection = db["products"]

# Spécifier le chemin d'accès au fichier CSV
fichier_source = './french_products.openfoodfacts.csv'

# Parcourir les lignes du fichier CSV et les insérer dans la base de données
with open(fichier_source, 'r', encoding='utf-8') as input_file:
    # Créer un lecteur CSV pour lire le fichier d'entrée
    lecteur_csv = csv.DictReader(input_file)

    for ligne in lecteur_csv:
        # Transformer le champ 'categories' en tableau
        if(ligne['categories'] != ""):
            categories = ligne['categories'].split(',')
            for i in range(len(categories)):
                categories[i] = categories[i].strip().capitalize()
        else:
            categories = []

        # Commencer les marques par une majuscule
        valeursMarques = ligne['brands'].split(",")        
        valeursMarques = [valeur.strip().capitalize() for valeur in valeursMarques]
        marques_clean = ", ".join(valeursMarques)

        # Commencer les certifications par une majuscule
        valeursLabel = ligne['labels'].split(",")        
        valeursLabel = [valeur.strip().capitalize() for valeur in valeursLabel]
        labels_clean = ", ".join(valeursLabel)

        # Calculer le score /100
        if(ligne['nutriscore_score'] != ""):
            score_min = -15
            score_max = 40
            nouveau_score_min = 100
            nouveau_score_max = 0

            new_nutriscore_score = int(ligne['nutriscore_score'])
            calculatedScore = (new_nutriscore_score - score_min) * (nouveau_score_max - nouveau_score_min) / (score_max - score_min) + nouveau_score_min
            calculatedScore = round(calculatedScore, 2)
        else:
            calculatedScore = None
            new_nutriscore_score = None

        if(ligne['ecoscore_score'] != ""):
            if '.' in ligne['ecoscore_score']:
                new_ecoscore_score = int(float(ligne['ecoscore_score']))
            else:
                new_ecoscore_score = int(ligne['ecoscore_score'])
        else:
            new_ecoscore_score = None

        if(ligne['nova_group'] != ""):
            new_nova_group = int(ligne['nova_group'])
        else:
            new_nova_group = None

        # Nettoyer ecoscore grade
        if(ligne['ecoscore_grade'] == "unknown" or ligne['ecoscore_grade'] == "" or len(ligne['ecoscore_grade']) > 1) :
            new_ecoscore_grade = None
        else:
            new_ecoscore_grade = ligne['ecoscore_grade']

        # Nettoyer additives
        if(ligne['additives_tags'] != ""):
            new_additives = ligne['additives_tags'].split(',')
            for i in range(len(new_additives)):
                new_additives[i] = new_additives[i].split(':')[-1].strip().upper()
        else:
            new_additives = []


        # Récupérer la main category
        if(ligne['main_category'] != ""):
            with open('./categories.json', 'r', encoding='utf-8') as f:
                categories_json = json.load(f)

            # Accéder à l'objet de la catégorie
            categorie_objet = categories_json.get(ligne['main_category'])
            main_cat_fr = ""
            if categorie_objet is not None:
                main_cat_fr = categorie_objet.get("name", {})
                if main_cat_fr is not None:
                    main_cat_fr = main_cat_fr.get("fr", "")
                    if main_cat_fr is None:
                        main_cat_fr = ""
                else:
                    main_cat_fr = ""
        else:
            main_cat_fr = ""
        
        if main_cat_fr == "" and len(categories) > 0:
            main_cat_fr = categories[-1]

        
        # Récupérer les allergenes
        if(ligne['allergens'] != ""):
            with open('./allergens.json', 'r', encoding='utf-8') as allerg:
                allerg_json = json.load(allerg)

            new_allergens = ligne['allergens'].split(',')
            for i in range(len(new_allergens)):
                new_allergens[i] = new_allergens[i].strip()
                new_allergens[i] = allerg_json.get(new_allergens[i])
        else:
            new_allergens = []


        # Récupérer les traces
        if(ligne['traces_tags'] != ""):
            with open('./allergens.json', 'r', encoding='utf-8') as traces:
                traces_json = json.load(traces)

            new_traces = ligne['traces_tags'].split(',')
            for i in range(len(new_traces)):
                new_traces[i] = new_traces[i].strip()
                new_traces[i] = allerg_json.get(new_traces[i])
        else:
            new_traces = []

        # Récupérer les niveaux de nutrition
        if(ligne['nutrient_levels_tags'] != ""):
            with open('./nutrientLevels.json', 'r', encoding='utf-8') as nutrientLevels:
                nutrientLevels_json = json.load(nutrientLevels)

            new_nutrientLevels = ligne['nutrient_levels_tags'].split(',')
            for i in range(len(new_nutrientLevels)):
                new_nutrientLevels[i] = new_nutrientLevels[i].strip()
                new_nutrientLevels[i] = nutrientLevels_json.get(new_nutrientLevels[i])
            nutrientLevels_clean = ", ".join(new_nutrientLevels)
        else:
            nutrientLevels_clean = ""


        # Créer un dictionnaire pour représenter la ligne
        nouvelle_ligne = {
            'name': ligne['product_name'].strip().capitalize(),
            'barcode': ligne['code'],
            'brand': marques_clean,
            'imageUrl': ligne['image_url'],
            'quantity': ligne['quantity'],
            'mainCategory': main_cat_fr,
            'categories': categories,
            'certifications': labels_clean,
            'ingredients': ligne['ingredients_text'].capitalize(),
            'allergens': new_allergens,
            'traces': new_traces,
            'additives': new_additives,
            'calculatedScore': calculatedScore,
            'nutriscoreScore': new_nutriscore_score,
            'nutriscoreGrade': ligne['nutriscore_grade'],
            'ecoscoreScore': new_ecoscore_score,
            'ecoscoreGrade': new_ecoscore_grade,
            'novaGroup': new_nova_group,
            'nutrientLevelsReference': nutrientLevels_clean,
            'energy_kcal_100g': float(ligne['energy-kcal_100g']) if ligne['energy-kcal_100g'] else None,
            'fat_100g': float(ligne['fat_100g']) if ligne['fat_100g'] else None,
            'saturated_fat_100g': float(ligne['saturated-fat_100g']) if ligne['saturated-fat_100g'] else None,
            'carbohydrates_100g': float(ligne['carbohydrates_100g']) if ligne['carbohydrates_100g'] else None,
            'sugars_100g': float(ligne['sugars_100g']) if ligne['sugars_100g'] else None,
            'fiber_100g': float(ligne['fiber_100g']) if ligne['fiber_100g'] else None,
            'proteins_100g': float(ligne['proteins_100g']) if ligne['proteins_100g'] else None,
            'salt_100g': float(ligne['salt_100g']) if ligne['salt_100g'] else None,
            'sodium_100g': float(ligne['sodium_100g']) if ligne['sodium_100g'] else None
        }

        # Insérer la ligne dans la base de données
        collection.insert_one(nouvelle_ligne)


end_time = datetime.datetime.now()

execution_time = end_time - start_time
execution_time = str(execution_time).split(".")[0]

print(f"Script exécuté. Temps écoulé : {execution_time}")