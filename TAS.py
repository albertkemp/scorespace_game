import pyautogui
import time

# --- Setup ---
times = []
commands = []
try:
    with open('instr.txt', 'r') as file:
        lines = file.readlines()
        for line in lines:
            # Handle empty lines and split
            line = line.strip()
            if not line:
                continue
            
            lineArray = line.split(',')
            # Ensure we have at least time and an action (even if empty)
            if len(lineArray) >= 1:
                times.append(lineArray[0])
                # Ensure the command is not missing (use empty string if it is)
                commands.append(lineArray[1] if len(lineArray) > 1 else '')
except FileNotFoundError:
    print("Error: The file 'instr.txt' was not found.")
except Exception as e:
    print(f"An error occurred: {e}")

commands_ms = []
last_pressed_key = None # Tracks the last key to be pressed down

for i in range(len(times)):
    time_ms = times[i]
    action = commands[i]

    if action:
        # 1. New key press event (e.g., 'a', 'd', 'f', 'i')
        # Format: (Time, Key_To_Press)
        commands_ms.append((time_ms, action.lower()))
        last_pressed_key = action.lower() # Store the key for the next release
    
    elif last_pressed_key is not None:
        # 2. Key release event (empty action string)
        # Format: (Time, -Key_To_Release)
        commands_ms.append((time_ms, "-" + last_pressed_key))
        # Clear the last_pressed_key state after release
        last_pressed_key = None
        
    # If action is empty and last_pressed_key is None, it's a redundant entry, so skip.

# The rest of your execution function remains the same

def execute_timed_commands(commands):
    """Executes a list of commands based on their millisecond timestamps."""

    # Give yourself a few seconds to switch to the target window
    print("Starting in 5 seconds. Switch to the target window.")
    time.sleep(5)

    last_time_ms = 0 # Track the time of the last executed command

    for time_ms_str, action_str in commands:
        time_ms = int(time_ms_str)

        # 1. Calculate the delay until the next action
        delay_ms = time_ms - int(last_time_ms)

        # 2. Convert delay to seconds for time.sleep()
        delay_s = delay_ms / 1000.0

        # 3. Wait for the required delay
        if delay_s > 0:
            # print(f"Waiting for {delay_ms}ms ({delay_s}s)...")
            time.sleep(delay_s)

        # 4. Execute the command
        key = action_str.lstrip('-') # Get the key name (e.g., 'a' from '-a')

        if action_str.startswith('-'):
            # Key Release (e.g., "-a" -> keyUp('a'))
            pyautogui.keyUp(key)
            print(f"Time {time_ms}ms: keyUp('{key}')")
        else:
            # Key Press/Down (e.g., "a" -> keyDown('a'))
            pyautogui.keyDown(key)
            print(f"Time {time_ms}ms: keyDown('{key}')")

        # 5. Update the last_time_ms for the next iteration's calculation
        last_time_ms = time_ms

    print("Execution finished.")

if __name__ == "__main__":
    execute_timed_commands(commands_ms)