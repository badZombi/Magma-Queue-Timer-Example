This is just a simple example of one possible way of setting up a queued timer for magma. The idea is to have a single timer instance that can handle many different player requests.

Feel free to install it and try it out.

## Commands:

+ **/extimer *(phrase : optional)* :** this will create a new entry in the queue and start the timer if its not already running. if you enter a phrase, it is what you will see in the notice when the entry executes... if not it will just show your name.
+ **/cleartimers :** pretty obvious. this will flush the ds queue
+ **/listtimers :** will show pending timers

On first run it will create an ini file. if you want to change settings you can do so and then execute magma.reload in console.

## Settings:
+ **run_timer:** time between queue checks. (in seconds) this can be pretty low IMO. The timer will stop when the queue is empty and will restart when a new entry is added. Assuming you are using this for a simple delay before executing a TP home or something like that you should be ok even with a lot of players.
+ **execute_delay:** actual time in seconds before the event will trigger/execute
+ **expiration:** I added this in case there was an error. if somehow an entry is missed and goes over my this number of seconds, it will be removed and will not execute. this never happened in testing but I guess it could if the timer crashed and was restarted before the queue was empty.
+ **example_message:** Just the chat message that will pop up for the example
+ **chatname:** the name for messages and broadcasts

There is a discussion [here on gomagma.org](http://gomagma.org/community/index.php?threads/single-timer-multiple-results-example.1327/) if you have any questions.

-BadZombi