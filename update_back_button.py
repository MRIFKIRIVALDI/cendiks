import os
import re

# Directory containing the session files
directory = 'pages/sessions'

# Pattern to match the back button href
pattern = r'href="\.\./install\.html"'

# Replacement href
replacement = 'href="../sessions.html"'

# Process each HTML file in the directory
for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()

        # Replace the href
        new_content = re.sub(pattern, replacement, content)

        # Write the updated content back to the file
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)

print("Back button href updated to ../sessions.html for all session files.")
