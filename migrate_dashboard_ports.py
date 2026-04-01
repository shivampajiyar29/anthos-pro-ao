import os

def migrate_port(directory, old_port, new_port):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.json')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if old_port in content:
                        print(f"Migrating {path}...")
                        new_content = content.replace(old_port, new_port)
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                except Exception as e:
                    print(f"Error in {path}: {e}")

if __name__ == "__main__":
    migrate_port(r"c:\Users\SHIVA\OneDrive\Desktop\vishnulaxmi_ai\dashboard", "localhost:8000", "localhost:8001")
    migrate_port(r"c:\Users\SHIVA\OneDrive\Desktop\vishnulaxmi_ai\dashboard", "0.0.0.0:8000", "0.0.0.0:8001")
    migrate_port(r"c:\Users\SHIVA\OneDrive\Desktop\vishnulaxmi_ai\dashboard", ":8000/", ":8001/")
