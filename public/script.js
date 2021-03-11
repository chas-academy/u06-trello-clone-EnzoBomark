//variables
let dropzones = document.querySelectorAll('.dropzone');
let dataCards = {
    order:[],
    cards:[],
    config: {
        maxid:-1 
    } 
};
let bords = [];
let dataPositions = [
    {pos:"one", title:"to do"},
    {pos:"two", title:"in progress"},
    {pos:"three", title:"testing"},
    {pos:"four", title:"done"},
];

//initialize
$(document).ready(()=>{

    // Create Kanban Board
    initializeKanbanBoards();
    // Display cards inside localStorage
    if(JSON.parse(localStorage.getItem('@data'))){
        dataCards = JSON.parse(localStorage.getItem('@data'));
        bords = JSON.parse(localStorage.getItem('@order'));
        initializeComponents(dataCards, bords);
    }
    
    $('#add').click(()=>{
        // Create Title if it isn't empty
        const title = $('#titleInput').val()!==''?$('#titleInput').val():null;
        // Create Description if it isn't empty
        const description = $('#descriptionInput').val()!==''?$('#descriptionInput').val():null;
        // Create Card if Title and Description isn't null
        
        if(title && description){
            let id = dataCards.config.maxid+1;
            const newCard = {
                id,
                title,
                description,
                date: false,
                color:'#E5E7EB',
                class: '',
                position:"one",
                priority: false
            };
            dataCards.cards.push(newCard);
            dataCards.config.maxid = id;

            sortable();
            saveCards(dataCards);
            appendComponents(newCard);
            initializeCards();
        }
    });
    
    $("#deleteAll").click(() => localStorage.clear());
    tooltip();
    progressWidget(bords);
    dialogWiget();
    initializeCards();
    sortable();
});

//functions
const sortable = () => {
   
    $(function() {
        $(".kanbanZone")
            .sortable({
                connectWith: ".kanbanZone",
                opacity: 0.8, 
                receive: function( event, ui ) {
                    dataCards.cards[ui.item[0].id].position = this.id;
                    saveCards(dataCards);
                },
                stop: function () {
                    let bords = [
                    $('#one').sortable("toArray"), 
                    $('#two').sortable("toArray"),
                    $('#three').sortable("toArray"),
                    $('#four').sortable("toArray"),
                    ];

                    saveOrder(bords);
                    progressWidget(bords);
                }
            })
        .disableSelection();
        let bords = [
            $('#one').sortable("toArray"), 
            $('#two').sortable("toArray"),
            $('#three').sortable("toArray"),
            $('#four').sortable("toArray"),
            ];

            saveOrder(bords);

    });
};

const initializeKanbanBoards = () => {
    dataPositions.forEach(item=>{
        const htmlElements = 
        `<div class="board">
            <h3 class="text-sm font-bold ml-3">${item.title.toUpperCase()}</h3>
            <div class="kanbanZone h-full mt-4" id="${item.pos}"></div>
        </div>`
        $("#boardsContainer").append(htmlElements)
    });
};

const initializeComponents = (dataArray, bords) => bords.forEach(bord => bord.forEach(index => appendComponents(dataArray.cards[index])));

const initializeCards = () => cards = document.querySelectorAll('.kanbanCard');

const appendComponents = (card) =>{
    //creates new card inside of the todo area

    const htmlElements = `
        <div id=${card.id.toString()} class="relative kanbanCard ${card.class}" onclick="dialogWiget(${card.id.toString()})">
            <h4 class="text-xl font-medium">${(card.title != null) ? ((card.title.length < 16) ? card.title : card.title.substring(0,16) + "...") : "" }</h4>
            <p class="text-sm mt-1 font-normal">${(card.description != null) ? ((card.description.length < 24) ? card.description : card.description.substring(0,24) + "...") : "" }</p>
            <p class="text-xs mt-5 font-light text-gray-400">${(card.date) ? card.date : 'No Due Date'}</p>
            <span class="text-sm font-light absolute right-3 top-3">
                <svg
                class="w-5 h-5 ${(card.priority) ? "text-yellow-400" : "text-yellow-100"}"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                >
                <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
                </svg>
            </span>
        </div>
    `

    const dialogElements = `
        <div id="dialog-${card.id.toString()}" class="dialog relative">

                <form>
                    <button id="span-${card.id.toString()}" onclick="togglePriority(this)" class="absolute left-5 top-5  inline-block p-3 text-center text-white transition border ${(card.priority) ? "border-yellow-400" : "border-yellow-200"} rounded-full ripple hover:bg-yellow-100 focus:outline-none ${card.priority? "is-priority": ""}">
                        <svg
                        class="w-5 h-5 ${(card.priority) ? "text-yellow-400" : "text-yellow-200"} "
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        >
                        <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                        </svg>
                    </button>
                </form>
                
                <h4 class="text-3xl px-16 py-2">${(card.title != null) ? ((card.title.length < 16) ? card.title : card.title.substring(0,16) + "...") : "" }</h4>
                
                <ul> 
                    <li><a class="absolute right-5 top-5 inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-green-500 rounded shadow ripple hover:shadow-lg hover:bg-green-600 focus:outline-none" href="#tabs-1-${card.id.toString()}">Main</a></li>
                    <li><a href="#tabs-2-${card.id.toString()}" class="right-5 bottom-5 absolute inline-block p-3 text-center text-white transition bg-red-500 rounded-full shadow ripple hover:shadow-lg hover:bg-red-600 focus:outline-none">
                    
                    <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                    />
                    </svg>
                </a></li>
                </ul>
            
            <div id="tabs-1-${card.id.toString()}">
                <textarea class="resize-none text-md rounded-md px-8 py-5 bg-gray-100 w-full my-3 h-72" contenteditable="true" onblur="updateDescription(this.value.toString(), ${card.id.toString()})">${card.description}</textarea>
                <div class="w-3/12 absolute left-5 bottom-5">
                    <input class="w-11/12 inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-black rounded shadow ripple waves-light hover:shadow-lg focus:outline-none cursor-pointer placeholder-white" type="text" id="datepicker-${card.id.toString()}" placeholder="${(dataCards.cards[card.id].date) ? dataCards.cards[card.id].date : 'Date'}">
                </div>
                <div id="my-widget-${card.id}" class="absolute left-36 bottom-4"></div>
            </div>
            
            <div id="tabs-2-${card.id.toString()}">
                <p class="text-center font-bold mt-16">Are you sure you want to DELETE this card?</p>
                <p class="text-center">Once deleted there is no return</p>
                <form class="flex justify-center mt-8">
                    <button class="inline-block w-10/12 px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-red-500 rounded shadow ripple hover:shadow-lg hover:bg-red-600 focus:outline-none" onclick="deleteCard(${card.id})">delete</button>
                </form>
            </div>
        </div>
    `

    $(`#${card.position}`).append(htmlElements);
    $(`#body`).append(dialogElements);
};

const togglePriority = (span) => {
    span.classList.toggle("is-priority");
    dataCards.cards.forEach(card=>{
        if(span.id.split('-')[1] === card.id.toString()) card.priority=card.priority?false:true;
    })
    saveCards(dataCards);
};

const deleteCard = (id) =>{
    bords = bords.map(card => card.filter(i => i != id));
    saveOrder(bords);
}; 

const progressWidget = (bords) => {

    let percentage = bords.reduce((acc, bord, index) => {
        if(index === 3) return (bord.length)/(acc + bord.length) *100;
        return acc + bord.length;
    }, 0);

    $( function() {

        $( "#progressbar" ).progressbar({
            value: percentage ? percentage : 0.1
        });
    });
};

const tooltip = () => {
    $( function() {
        $( document ).tooltip({
            tooltipClass: "tooltip",
        });
    });
};

const updateDescription = (newText, id) => {
    dataCards.cards[id].description = newText;
    saveCards(dataCards);
};

const saveCards = (dataCards) => localStorage.setItem('@data', JSON.stringify(dataCards));

const saveOrder = (bords) => localStorage.setItem('@order', JSON.stringify(bords));

const dialogWiget = () =>{

    dataCards.cards.forEach(card => {
        $( function() {
            $( `#dialog-${card.id}` ).dialog({
                dialogClass: 'no-close',
                width: 500,
                height: 500,
                draggable: false,
                autoOpen: false,
                show:{
                    effect: "fade",
                    duration: 100
                },
                hide:{
                    effect: "fade",
                    duration: 100
                },
                close: function() { location.reload(); }
            });
        });

        $( `#${card.id}`).on('click', function(){
            $(`#dialog-${card.id}`).dialog('open');
        })

        $( function() {
            $(`#dialog-${card.id}`).tabs();
          } );

        $( function() {
            $(`#datepicker-${card.id}`).datepicker({
                onSelect: function() { 
                    dataCards.cards[card.id].date = this.value;
                    saveCards(dataCards);
                }
            });
        });

        //Custom widget
        $( function() {
            $.widget( "custom.colorize", {
                
                _create: function() { 
                    this._button = $("<button>", { "class": "rounded-full focus:outline-none"}); 
                    this._button.width(this.options.width) 
                    this._button.height(this.options.height) 
                    this._button.css("background-color", this.options.color);    
                    $(this.element).append(this._button);

                    this._on( this._button, {
                        // _on won't call random when widget is disabled
                        click: "random"
                    });
                },
                 
                _setOption: function(key, value) { 
                    switch (key) { 
                       case "width": 
                       this._button.width(value); 
                       break; 
                       case "height": 
                       this._button.height(value); 
                       break; 
                       case "color":
                       this._button.css("background-color",value);
                       break; 
                    } 
                },

                random: function(  ) {
                    colors = [
                        ['#6B7280', 'gray'],
                        ['#EF4444', 'red'],
                        ['#F59E0B', 'yellow'],
                        ['#10B981', 'green'],
                        ['#3B82F6', 'blue'],
                    ];

                    let randomColor = colors[Math.floor(Math.random()*colors.length)];

                    while (randomColor[0] == dataCards.cards[card.id].color) {
                        randomColor = colors[Math.floor(Math.random() * colors.length)];
                    }

                    this._button.css("background-color", randomColor[0]); 
                    dataCards.cards[card.id].color = randomColor[0];   
                    dataCards.cards[card.id].class = randomColor[1];   
                    saveCards(dataCards);
                },
            });
           
            // Initialize with default options
            $( `#my-widget-${card.id}` ).colorize();
            $( `#my-widget-${card.id}` ).colorize("option", {width:30,height:30,color: dataCards.cards[card.id].color});
         
        });
    });
};


