# DFA Visualizer Documentation
This is the documentation for my DFA Visualizer project which you can find [here](https://www.github.com/vspecky/dfa-visualizer).  
![DFA](https://www.github.com/vspecky/dfa-visualizer/tree/master/docs/imgs/machine.png)

## Layout
The visualizer consists of a canvas on which you shall be making your Deterministic Finite Automaton. Scrolling downwards, you will see a set of buttons and input boxes. These allow you to dictate the various parameters and the behavior of your automaton and are divided into three categories :-
- Control  
- Setup  
- Save/Load

## Getting Started
The visualizer has three modes of functioning :-  
- Node Mode
- Arrow Mode
- Play Mode  

When you open up the Visualizer, you will see that almost all of the input fields are disabled. This is becase the first thing you always want to do is input your Character Set. To do this, just scroll down to the `Set Characters` input field, enter your characters (For example: 'ab', 'abcxyz', etc, without the quotation marks) and click the button. You will see the other fields becoming enabled now and your character set will appear at the top left of the Visualizer. To reset the Visualizer, click the Reset button or press `Alt + R`
![Set Characters](https://www.github.com/vspecky/dfa-visualizer/tree/master/docs/imgs/set_chars.png) 

## Node Mode
Lets add some nodes now. Enable Node mode by either clicking the respective control button or pressing `Alt + S`. There are three types of nodes, `Standard`, `Final`, and `Reject`  
- `Standard` Nodes are normal state nodes and are denoted by a circle. To add a `Standard` Node, press and hold the `S` key and click anywhere on the canvas.  
- `Final` Nodes represent final states and are denoted by two concentric circles. To add a `Final` Node, press and hold the `F` key and click anywhere on the canvas.  
- `Reject` nodes look like Standard nodes but have a `R` within. To add a `Reject` node, press and hold the `R` key and click anywhere on the canvas.  
- Hold the `F` key and click on a `Standard` node to convert it into a `Final` node and vice versa.  
- Press and hold the `Alt` key and click on a Node to delete it.  
- Click on a node and drag your mouse to move it.  

You will notice that the nodes are automatically labelled starting from `q0` and the node `q0` is always Yellow in color. This is because the node `q0` is the input node by default (You cannot change this).  
![Node Types](https://www.github.com/vspecky/dfa-visualizer/tree/master/docs/imgs/node_types.png)  

## Arrow Mode
Lets now add some arrows to our automaton to denote transactions. Enable Arrow mode by either clicking the respective control button or pressing `Alt + A`.  
- Lets say your Character Set comprises of 'ab'. To add an arrow labelled 'a' from a node to another, hold down the `A` key, click on the first node, and without letting go of the `A` key, click on the second node (or you can click on the same node for a self-loop) to add an arrow from the first node to the second node. Similarly, hold the `B` key for a 'b' labelled arrow and so on. If a character is not in your Character set, you cannot add a arrow labelled with that character.
- You will see that every arrow has two squares. You can click within these squares and drag your mouse to change the orientation of the arrow. These squares disappear when you switch back to Node mode.
- To delete an arrow, hold the `Alt` key and click within one of the two squares of the arrow.  
![Arrow Mode](https://www.github.com/vspecky/dfa-visualizer/tree/master/docs/imgs/arrow_mode.png)  

## Playing/Testing your Automaton
Once you have created your automaton, you might want to test it against various test cases.
- The first thing you want to do is set a Start String, an End String and a Substring depending on your automaton (You don't have to set all fields).  
- If you want to allow overlapping between the Start, End and Sub strings, click the `Overlap` button. The button is Red when disabled and Green when enabled.  
- Now all you need to do is enter a string in the Play input field and click `Play`.  
- The string you entered will appear at the top of the canvas with a red character. The red character is the one the automaton is currently evaluating.
- The automaton will evaluate the string step-wise and you will be able to see this visually since the yellow pointer (the one that was initially on `q0`) will move around your automaton depending on the state transactions as the Visualizer evaluates each character.  
- At the end of evaluation, the Visualizer will display a message below the canvas informing you of the results.  
![Playing](https://www.github.com/vspecky/dfa-visualizer/tree/master/docs/imgs/playing.png)  

## Saving/Loading Automatons
At any point, you can scroll down and click the `Save to JSON` button to get a JSON representation of your Automaton in the text-area. You can copy and save this anywhere you want or share it with others. Others can take your automaton's JSON string, put it in the same text-area and click `Load from JSON` to load your Automaton.