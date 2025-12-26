import random
import json
from datetime import datetime, timedelta
import uuid

# Using built-in Python modules to generate realistic fake data

# Define constants based on the spec
ROLES = ['rep', 'manager', 'admin']
DEAL_STAGES = ['prospecting', 'qualification', 'needs_analysis', 'proposal', 'negotiation', 'closed_won', 'closed_lost']
ACTIVITY_TYPES = ['call', 'email', 'meeting', 'demo', 'follow_up', 'proposal_sent']
SOURCES = ['referral', 'web', 'event', 'cold_call', 'social_media', 'advertising']
INDUSTRIES = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Automotive', 'Real Estate']
COMPANY_SIZES = ['small', 'medium', 'large', 'enterprise']
PRODUCTS = ['Product A', 'Product B', 'Product C', 'Service Package', 'Consulting']
REGIONS = ['North', 'South', 'East', 'West', 'Central']

def generate_users(num_users=20):
    """Generate fake user data based on the spec"""
    # Sample names to use instead of Faker
    first_names = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
                   'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
                   'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Helen', 'Mark', 'Sandra',
                   'Donald', 'Donna', 'Steven', 'Carol', 'Paul', 'Ruth', 'Andrew', 'Sharon', 'Joshua', 'Michelle',
                   'Kenneth', 'Laura', 'Kevin', 'Sarah', 'Brian', 'Kimberly', 'George', 'Deborah', 'Edward', 'Dorothy']
    last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
                  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
                  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts']

    users = []
    for i in range(num_users):
        user = {
            'user_id': f"user_{i+1:03d}",
            'name': f"{random.choice(first_names)} {random.choice(last_names)}",
            'role': random.choice(ROLES),
            'team_id': f"team_{random.randint(1, 5):02d}",
            'region': random.choice(REGIONS),
            'joining_date': str(datetime.now().date() - timedelta(days=random.randint(0, 1095))),  # Up to 3 years ago
            'status': random.choice(['active', 'inactive'])
        }
        users.append(user)
    return users

def generate_leads(num_leads=100):
    """Generate fake lead data based on the spec"""
    leads = []
    for i in range(num_leads):
        lead = {
            'lead_id': f"lead_{i+1:04d}",
            'created_at': str(datetime.now().date() - timedelta(days=random.randint(0, 730))),  # Up to 2 years ago
            'source': random.choice(SOURCES),
            'industry': random.choice(INDUSTRIES),
            'company_size': random.choice(COMPANY_SIZES),
            'owner_user_id': f"user_{random.randint(1, 20):03d}",
            'status': random.choice(['new', 'contacted', 'qualified', 'unqualified', 'converted'])
        }
        leads.append(lead)
    return leads

def generate_opportunities(num_opportunities=150):
    """Generate fake opportunity/deal data based on the spec"""
    opportunities = []
    for i in range(num_opportunities):
        stage = random.choice(DEAL_STAGES)
        deal_value = random.randint(5000, 500000)

        opportunity = {
            'deal_id': f"deal_{i+1:04d}",
            'lead_id': f"lead_{random.randint(1, 100):04d}",
            'owner_user_id': f"user_{random.randint(1, 20):03d}",
            'stage': stage,
            'deal_value': deal_value,
            'probability': random.uniform(0.1, 0.95) if stage not in ['closed_won', 'closed_lost'] else (1.0 if stage == 'closed_won' else 0.0),
            'expected_close_date': str(datetime.now().date() + timedelta(days=random.randint(0, 180))),  # Next 6 months
            'actual_close_date': None,
            'created_at': str(datetime.now().date() - timedelta(days=random.randint(0, 730))),  # Up to 2 years ago
            'updated_at': str(datetime.now().date() - timedelta(days=random.randint(0, 365))),  # Up to 1 year ago
            'loss_reason': None,
            'product': random.choice(PRODUCTS),
            'region': random.choice(REGIONS)
        }

        # If deal is closed, set actual close date and possibly loss reason
        if stage == 'closed_won':
            opportunity['actual_close_date'] = str(datetime.now().date() - timedelta(days=random.randint(0, 365)))  # Up to 1 year ago
        elif stage == 'closed_lost':
            opportunity['actual_close_date'] = str(datetime.now().date() - timedelta(days=random.randint(0, 365)))  # Up to 1 year ago
            opportunity['loss_reason'] = random.choice(['price', 'competitor', 'no_budget', 'lost_interest', 'decision_delayed'])

        opportunities.append(opportunity)
    return opportunities

def generate_activities(num_activities=300):
    """Generate fake activity data based on the spec"""
    activities = []
    for i in range(num_activities):
        activity = {
            'activity_id': f"act_{i+1:05d}",
            'deal_id': f"deal_{random.randint(1, 150):04d}",
            'user_id': f"user_{random.randint(1, 20):03d}",
            'activity_type': random.choice(ACTIVITY_TYPES),
            'activity_date': str(datetime.now().date() - timedelta(days=random.randint(0, 180))),  # Last 6 months
            'duration_minutes': random.randint(15, 120),
            'outcome': random.choice(['positive', 'neutral', 'negative'])
        }
        activities.append(activity)
    return activities

def generate_targets(num_targets=50):
    """Generate fake target data based on the spec"""
    targets = []
    for i in range(num_targets):
        # Generate a random month within the last 6 months to next 6 months
        months_offset = random.randint(-6, 6)
        target_month = datetime.now().date().replace(day=1) + timedelta(days=30*months_offset)
        target = {
            'target_id': f"tgt_{i+1:03d}",
            'user_id': f"user_{random.randint(1, 20):03d}",
            'time_period': target_month.strftime('%Y-%m'),
            'target_value': random.randint(10000, 200000)
        }
        targets.append(target)
    return targets

def main():
    """Generate all datasets and save to JSON files"""
    print("Generating fake sales data based on specification...")
    
    users = generate_users()
    leads = generate_leads()
    opportunities = generate_opportunities()
    activities = generate_activities()
    targets = generate_targets()
    
    # Save each dataset to a separate JSON file
    datasets = {
        'users': users,
        'leads': leads,
        'opportunities': opportunities,
        'activities': activities,
        'targets': targets
    }
    
    for dataset_name, data in datasets.items():
        with open(f'{dataset_name}.json', 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Generated {len(data)} {dataset_name} records")
    
    print("\nAll datasets generated successfully!")
    print("\nData structure based on the sales dashboard specification:")
    print("- Users: Sales team members with roles, regions, etc.")
    print("- Leads: Potential customers with source, industry, etc.")
    print("- Opportunities: Deals in various stages with values and probabilities")
    print("- Activities: Sales activities with types and outcomes")
    print("- Targets: Performance targets for users over time periods")

if __name__ == "__main__":
    main()