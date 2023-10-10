# idk_engine
A rudimentary JS Game Engine

** Not yet ready for use **

Thought I'd try to build my own Game Engine to learn from all the walls I'll hit along the way.

The structure is quite rigid at the moment, and looks something like
 - /index.html - The entry point for the game
 - /game - Game files folder
   - /game/main.js - Main game logic entry point, exports update()
 - /engine - Engine files folder
   - /engine/engine.js - Game engine entry point. Imports /game/main.js

I've just started, so all it can be used for right now is
 - Load a basic scene that sets the canvas context and loads game objects into the scene
 - Tick a global main() function on every frame
 - Provide a basic GameObject class that can be used to create your own game objects and track their positions
 - Provide a Sprite class that extends GameObject, takes in a sprite sheet and preloads animations from it



