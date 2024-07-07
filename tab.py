def add_tab_to_text_file(input_file_path, output_file_path):
    with open(input_file_path, 'r') as file:
        lines = file.readlines()

    with open(output_file_path, 'w') as file:
        for line in lines:
            file.write(f'  {line}')  # Two spaces added here

# Example usage
input_file_path = 'tab.txt'
output_file_path = 'tab.txt'
add_tab_to_text_file(input_file_path, output_file_path)