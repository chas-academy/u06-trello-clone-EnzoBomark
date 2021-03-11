### Built With

* [Sass](https://sass-lang.com)
* [Tailwind](https://tailwindcss.com/)
* [Jquery](https://jquery.com/)
* [JqueryUi](https://jqueryui.com/)

## What?
This is a Kanban board app built with jquery and tailwind. Works with localStorage 

### Installation
<!--Insert Installation example. ex, npm install... -->
Open your terminal and then type
```
$ git clone https://github.com/EnzoBomark/Weather-app.git
```
This clones the repo

*You are done!* Now you can start editing the React project in the new folder that's created.

### Code Example
<!--Insert small code example-->
```JavaScript

const progressWidget = () => {

    let percentage = dataCards.order.reduce((acc, bord, index) => {
        if(index === 3) return (bord.length)/(acc + bord.length) *100;
        return acc + bord.length;
    }, 0);

    $( function() {

        $( "#progressbar" ).progressbar({
            value: percentage ? percentage : 0.1
        });
    });
};
```

## License

Distributed under the MIT License. 
