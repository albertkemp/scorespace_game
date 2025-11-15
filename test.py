import random

def generate_random_chance_object():
    """Generates a single 'chance' object with random properties,
    following the dimension rule based on the 'c' value.
    """
    # Define possible 'c' values (chance percentages)
    # <= 50% chances (w: 100, h: 100) and > 50% chances (w: 200, h: 150)
    chance_values = [
        '5%', '10%', '15%', '20%', '50%',
        '55%', '60%', '70%', '80%'
    ]
    
    # Randomly select a chance value
    c_value_str = random.choice(chance_values)
    
    # Convert chance string to integer for comparison
    c_value_int = int(c_value_str.strip('%')) 
    
    # Determine dimensions (w, h) based on the rule
    if c_value_int > 50:
        w_val, h_val = 200, 150
    else:
        w_val, h_val = 100, 100
        
    # Generate random coordinates
    x_val = random.randrange(0, 1000, 50)
    y_val = random.randrange(1000, 12000, 100)

    # Randomly select between 'chance' and 'block'
    name = random.choice(['chance', 'block'])
    
    # For 'block' objects, ensure the dimensions are the smaller set
    if name == 'block':
        w_val, h_val = 100, 100
        
    # Build the string representation for a single object
    object_str = f"""{{
        name: '{name}',
        x: {x_val},
        y: {y_val},
        w: {w_val},
        h: {h_val},"""
    
    if name == 'chance':
        hasCollided = random.choice(['true', 'false']) # Print boolean as lowercase string
        object_str += f"""
        hasCollided: {hasCollided},
        c: '{c_value_str}'
    }}"""
    else: # Block objects don't have hasCollided or c in your examples
        object_str += """
    }"""

    return object_str

def generate_random_level_data(num_lists=3, num_objects_per_list=20):
    """Generates the full data structure as a string."""
    output_lines = ["[\n"]
    
    for i in range(num_lists):
        object_list_str = []
        for _ in range(num_objects_per_list):
            object_list_str.append(generate_random_chance_object())
        
        # Join objects with a comma and indentation
        level_content = ',\n'.join(object_list_str)
        output_lines.append(f"""\t[\n{level_content}\n\t]""")
        
        # Add comma between lists (except for the last one)
        if i < num_lists - 1:
            output_lines.append(",\n")
        else:
            output_lines.append("\n")

    output_lines.append("]")
    
    return "".join(output_lines)

# --- Configuration ---
NUM_LEVELS = 3       
OBJECTS_PER_LEVEL = 10 # Reduced to 10 for a cleaner printout example

# --- Generation and Output ---
js_literal_data = generate_random_level_data(NUM_LEVELS, OBJECTS_PER_LEVEL)

## 🖨️ Generated JavaScript Object Literal
print("--- START OF GENERATED DATA ---\n")
print(js_literal_data)
print("\n--- END OF GENERATED DATA ---")