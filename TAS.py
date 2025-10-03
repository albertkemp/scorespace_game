import pyautogui
import time

# --- Setup ---
# All times are in milliseconds (ms)

# Structure: (Time_ms, Action_String)
# Action_String format: "KEY" for press, "-KEY" for release
# Example: "A" is pyautogui.keyDown('a'), "-A" is pyautogui.keyUp('a')
# 'AD' in your example must be broken down into 'A', then 'D' at the same time,
# or for simplicity, a sequence like this:

# NOTE: pyautogui.press('key') is a press and release. For continuous holding,
# use keyDown() and keyUp() as shown in the translation below.
times = []
commands = []
try:
    with open('instr.txt', 'r') as file:
        lines = file.readlines()
        for line in lines:
            lineArray = line.strip().split(',')
            times.append(lineArray[0])
            commands.append(lineArray[1])
except FileNotFoundError:
    print("Error: The file 'your_file.txt' was not found.")
except Exception as e:
    print(f"An error occurred: {e}")
print(times)
print(commands)

commands_ms = [
]
for i in range(0, len(times)):
    if (len(commands[i])==2):
        commands_ms.append((times[i], commands[i][0]))
        commands_ms.append((times[i], commands[i][1]))
    else:
        commands_ms.append((times[i], commands[i]))

def execute_timed_commands(commands):
    """Executes a list of commands based on their millisecond timestamps."""

    # Give yourself a few seconds to switch to the target window
    print("Starting in 3 seconds. Switch to the target window.")
    time.sleep(5)

    last_time_ms = 0 # Track the time of the last executed command

    for time_ms, action_str in commands:
        # 1. Calculate the delay until the next action
        delay_ms = int(time_ms) - int(last_time_ms)

        # 2. Convert delay to seconds for time.sleep()
        delay_s = delay_ms / 1000.0

        # 3. Wait for the required delay
        if delay_s > 0:
            print(f"Waiting for {delay_ms}ms ({delay_s}s)...")
            time.sleep(delay_s)

        # 4. Execute the command
        key = action_str.lstrip('-') # Get the key name (e.g., 'A' from '-A')

        if action_str.startswith('-'):
            # Key Release (e.g., "-A" -> keyUp('a'))
            pyautogui.keyUp(key.lower())
            print(f"Time {time_ms}ms: keyUp('{key.lower()}')")
        else:
            # Key Press/Down (e.g., "A" -> keyDown('a'))
            pyautogui.keyDown(key.lower())
            print(f"Time {time_ms}ms: keyDown('{key.lower()}')")

        # 5. Update the last_time_ms for the next iteration's calculation
        last_time_ms = time_ms

    print("Execution finished.")
if __name__ == "__main__":
    # Ensure all actions are lowercase for pyautogui
    commands_ms = [(t, a.lower()) for t, a in commands_ms]
    execute_timed_commands(commands_ms)