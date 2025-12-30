import os
import re

# Directory containing the session files
directory = 'pages/sessions'

# Replacement string
replacement = '''    <!-- Main Content -->
    <div class="container">
        <!-- Back Button -->
        <a href="../install.html" class="back-btn fade-in-up">
            <img src="../../images/logo_back.png" alt="Kembali">
            <span>Kembali</span>
        </a>
    </div>'''

# Pattern to match the header section
pattern = r'<!-- Header -->.*?</header>'

# Process each HTML file in the directory
for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()

        # Replace the header with the new content
        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

        # Write the updated content back to the file
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)

print("Header replacement completed for all session files.")
