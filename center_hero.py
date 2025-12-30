import os
import re

# Directory containing the session files
directory = 'pages/sessions'

# Pattern to match the Hero Section
pattern = r'<!-- Hero Section -->\s*<section class="bg-gradient-to-r from-blue-100 to-yellow-100 py-20">\s*<div class="container mx-auto px-4 text-center">\s*(.*?)\s*</div>\s*</section>'

# Replacement string using the .hero class for better centering
replacement = r'''<!-- Hero Section -->
<section class="hero">
    <div class="hero-content">
        \1
    </div>
</section>'''

# Process each HTML file in the directory
for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()

        # Replace the hero section with the new centered version
        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

        # Write the updated content back to the file
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)

print("Hero section centering completed for all session files.")
