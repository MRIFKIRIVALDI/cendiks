import os
import re
import glob

def fix_youtube_urls():
    """Fix YouTube embed URLs in session HTML files"""
    session_files = glob.glob('pages/sessions/session-*.html')

    for file_path in session_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Find youtu.be URLs in iframes
            pattern = r'src="https://youtu\.be/([^?"]+)(?:\?[^"]*)?"'
            matches = re.findall(pattern, content)

            if matches:
                print(f"Fixing {file_path}: found {len(matches)} YouTube URLs")

                # Replace each youtu.be URL with embed format
                for video_id in matches:
                    old_url = f'src="https://youtu.be/{video_id}?si='
                    new_url = f'src="https://www.youtube.com/embed/{video_id}"'

                    # Replace the URL (removing the si parameter)
                    content = re.sub(
                        rf'src="https://youtu\.be/{re.escape(video_id)}\?[^"]*"',
                        new_url,
                        content
                    )

                # Write back the fixed content
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)

                print(f"Fixed {file_path}")

        except Exception as e:
            print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    fix_youtube_urls()
    print("YouTube URL fixing completed!")
