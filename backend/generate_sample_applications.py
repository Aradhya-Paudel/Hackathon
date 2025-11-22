"""
Generate sample applications for all 33 wards in Pokhara
"""
import json
import uuid
import random
from datetime import datetime, timedelta

# Load existing data
def load_json(filename):
    try:
        with open(f'data/{filename}', 'r') as f:
            return json.load(f)
    except:
        return {}

def save_json(filename, data):
    with open(f'data/{filename}', 'w') as f:
        json.dump(data, f, indent=2)

# Sample data
first_names = [
    "Ram", "Shyam", "Hari", "Krishna", "Laxmi", "Sita", "Gita", "Radha", "Maya", "Rita",
    "Amit", "Anjali", "Bikash", "Deepak", "Binod", "Sunil", "Sunita", "Kabita", "Anita", "Sarita",
    "Prakash", "Prashant", "Puja", "Pooja", "Rajan", "Rajesh", "Ramesh", "Reena", "Rina", "Ritu",
    "Santosh", "Sanjay", "Sangeeta", "Sangita", "Suresh", "Sushma", "Sushil", "Shreya", "Shilpa", "Shruti"
]

last_names = [
    "Sharma", "Gurung", "Tamang", "Magar", "Thapa", "Rai", "Limbu", "Shrestha", "Adhikari", "Bhattarai",
    "Poudel", "Karki", "Khatri", "Bhandari", "Neupane", "Pandit", "Acharya", "Ghimire", "Khadka", "Subedi",
    "Basnet", "Lama", "Sherpa", "Budha", "Pun", "Chhetri", "Dahal", "Gautam", "Koirala", "Pokhrel"
]

phone_prefixes = ["984", "985", "986", "974", "975", "976"]

service_types = ["national-id", "birth-certificate", "marriage-certificate"]

statuses = ["Submitted", "In Progress", "Completed", "Rejected"]

# Generate random date within last 60 days
def random_date(days_ago_max=60):
    days_ago = random.randint(1, days_ago_max)
    date = datetime.now() - timedelta(days=days_ago)
    return date.isoformat()

# Generate random phone number
def random_phone():
    prefix = random.choice(phone_prefixes)
    number = ''.join([str(random.randint(0, 9)) for _ in range(7)])
    return f"{prefix}{number}"

# Generate random application
def generate_application(ward_number, citizen_id):
    app_id = str(uuid.uuid4())
    service_type = random.choice(service_types)
    status = random.choice(statuses)
    
    submitted_date = random_date(60)
    completed_date = None
    
    if status == "Completed":
        # Completed date is 3-15 days after submission
        submitted_dt = datetime.fromisoformat(submitted_date)
        completed_dt = submitted_dt + timedelta(days=random.randint(3, 15))
        completed_date = completed_dt.isoformat()
    
    # Random approval
    approved = None
    rejection_message = None
    if status == "Completed":
        approved = True
    elif status == "Rejected":
        approved = False
        rejection_messages = [
            "Incomplete documentation provided. Please submit all required documents.",
            "Photo quality does not meet requirements. Please provide a clearer photo.",
            "Address verification failed. Please provide valid proof of residence.",
            "Application form has errors. Please correct and resubmit.",
            "Missing required signatures. Please sign all necessary fields.",
            "Birth certificate original not provided. Copy is not acceptable.",
            "Marriage proof documents are incomplete."
        ]
        rejection_message = random.choice(rejection_messages)
    
    application = {
        "id": app_id,
        "user_id": citizen_id,
        "full_name": f"{random.choice(first_names)} {random.choice(last_names)}",
        "email": f"citizen{random.randint(1000, 9999)}@example.com",
        "phone": random_phone(),
        "address": f"Pokhara-{ward_number}, Kaski",
        "province": "Gandaki Province",
        "district": "Kaski",
        "municipality": "Pokhara Metropolitan City",
        "ward": ward_number,
        "service_type": service_type,
        "target_office_level": "local",
        "target_office_name": f"Ward {ward_number} - Pokhara Ward Office",
        "estimated_days": random.randint(7, 21),
        "status": status,
        "submitted_date": submitted_date,
        "completed_date": completed_date,
        "current_stage": status,
        "approved": approved,
        "rejection_message": rejection_message
    }
    
    return application

# Main execution
print("Loading existing applications...")
applications = load_json('applications.json')

print("Loading citizens...")
citizens = load_json('citizens.json')

# Get a citizen ID (or create a dummy one)
citizen_ids = list(citizens.keys()) if citizens else [str(uuid.uuid4())]

print("\nGenerating sample applications for all 33 wards...")
generated_count = 0

for ward_num in range(1, 34):
    # Generate 25-40 applications per ward
    num_apps = random.randint(25, 40)
    print(f"Generating {num_apps} applications for Ward {ward_num}...")
    
    for _ in range(num_apps):
        citizen_id = random.choice(citizen_ids)
        app = generate_application(ward_num, citizen_id)
        applications[app['id']] = app
        generated_count += 1

print(f"\nGenerated {generated_count} total applications")
print(f"Total applications in database: {len(applications)}")

print("\nSaving applications...")
save_json('applications.json', applications)

print("✅ Done! Sample applications generated successfully!")

# Print summary
print("\n📊 Summary by Ward:")
for ward_num in range(1, 34):
    ward_apps = [app for app in applications.values() 
                 if app.get('ward') == ward_num or app.get('target_office_name') == f"Ward {ward_num} - Pokhara Ward Office"]
    print(f"Ward {ward_num:2d}: {len(ward_apps):3d} applications")

