const app = Vue.createApp({
    data() {
        return {
            details:[]/*Stocker les pokémons */,
            popup:{id:1,name:'Bulbasaur',image:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',stats:''},/*Stocker les stats à afficher dans la popup pokémon*/
            popupPositions:{x:'45%',y:100},/*Stocker la position optimale basique de la popup */
        }
    },
    methods:{
        pokemonDataRequest(){
            /* Pour améliorer : récupérer la liste de tout les pokémon que l'on peut appeler via l'API Pokemon */
            /* puis faire un fetch pour chacun de ces pokémons pour éviter de chercher manuellement le nombre max de pokémon */
            if (!this.details.length){
                for(let i =1; i<899; i++){
                    fetch('https://pokeapi.co/api/v2/pokemon/'+i).then(resp=> resp.json()).then(data => {
                        let temporary = {id:0 ,name:'',image:'',stats:''};
                        temporary.id = data.id;
                        temporary.name = data.name;
                        temporary.name = temporary.name.charAt(0).toUpperCase() + temporary.name.slice(1);
                        temporary.image = data.sprites.front_default;
                        temporary.stats = data.stats;
                        for(let i =0; i<6; i++){
                            temporary.stats[i].stat.name = temporary.stats[i].stat.name.charAt(0).toUpperCase() + temporary.stats[i].stat.name.slice(1);
                        }
                        this.details.push(temporary);
                        this.sortById();
                        }  
                    ).catch(err => console.log(err));
                }
            }
        },
        displayPopup(id){
            /*Afficher la popup*/
            let index = 0;
            while(this.details[index].id != id ){
                index++;
            }
            this.popup.id = this.details[index].id;
            this.popup.name = this.details[index].name;
            this.popup.image = this.details[index].image;
            this.popup.stats = this.details[index].stats;
            let pop = document.getElementsByTagName('dialog')[0];
            let pokemon = document.getElementById(id);
            pop.style.left = this.popupPositions.x;
            pop.style.top = (pokemon.offsetTop + this.popupPositions.y)+'px';
            pop.setAttribute('open',true);
        },
        hidePopup(){
            /* Cacher la vue détaillé du pokémon*/
            let pop = document.getElementById("popup");
            pop.removeAttribute('open');
        },
        sortByName(){
            /*Trier le tableau contenant les pokémons par Nom */
            this.details.sort(function(a,b){
                if (a.name < b.name){
                    return -1;
                }
                if (a.name > b.name ){
                    return 1;
                }
                return 0;
            })
        },
        sortById(){
            /*Trier le tableau contenant les pokémons par Id */
            this.details.sort(function(a,b){
                return a.id - b.id;
            })
        },
        request(){
            /*Récupérer les données du form pour rediriger la recherche en fonction du type de recherche souhaité */
            let req = {field:'',selected:''};
            req.field = document.getElementById('field').value;
            req.selected = document.getElementById('type-search').options[document.getElementById('type-search').selectedIndex].text;
            this.showAll();
            if (req.selected == "By Name"){
                this.searchByName(req.field);
            }
            if (req.selected == "By Id" && req.field != ''){
                this.searchById(req.field);
            }
        },
        searchByName(name){
            /*Recherche par Nom d'un pokémon dans le tableau contenant les pokémons */
            let tab = document.getElementsByClassName('Pokemon-Tiles-Item');
            for(let i=0; i<tab.length; i++){
                if (tab[i].innerHTML.search(name) == -1 ){
                    tab[i].style.display = 'none';
                }
            }
        },
        searchById(id){
            /*Recherche par Id d'un pokémon dans le tableau contenant les pokémons */
            let tab = document.getElementsByClassName('Pokemon-Tiles-Item');
            for(let i=0; i<tab.length; i++){
                if (parseInt(tab[i].id) != parseInt(id) ){
                    tab[i].style.display = 'none';
                }
            }
        },
        showAll(){
            /*Affiche tout les pokémons*/
            let tab = document.getElementsByClassName('Pokemon-Tiles-Item');
            for(let i=0; i<tab.length; i++){
                    tab[i].style.display = 'block';
            }
        }
    },mounted(){
        /* Les fonctions à lancer dès le démarrage de l'app */
        this.pokemonDataRequest();
        document.getElementById('form').addEventListener("click",function(event){
            event.preventDefault();
        })
    }
})
