const songs = document.querySelector('.songs');
const audio = document.querySelector('audio');
const loop_btn = document.querySelector('#loop-btn');
const autoplay_btn = document.querySelector('#autoplay-btn');
const add_btn = document.querySelector('#add-btn');
const content_wrapper = document.querySelector('.content-wrapper');
let looping = true;
var selectedIndex = 0;
var list_song = [];
audio.autoplay = true;

add_btn.onchange = () => {
    let file = document.querySelector('input[type=file]').files[0];
    if (file?.type === 'audio/mpeg'){
        let song = {
            name: file.name.slice(0,  this.name.length - 4),
            source: (window.URL || window.webkitURL).createObjectURL(file)
        };
        let data = `<li><span onclick=selectSong(this) oncontextmenu=showmenus(event,this)>${song.name}</span></li>`;
        songs.insertAdjacentHTML('beforeend', data);
        list_song.push(song);
    } else alert(`${file.name} bukanlah sebuah lagu.`);
};

function selectSong(e) {
    document.querySelectorAll(".selected-song").forEach(element => element.classList.remove("selected-song"));
    content_wrapper.setAttribute('style', 'display: none;')
    e.classList.add("selected-song");
    for (let i = 0; i < songs.childNodes.length; i++){
        if (songs.childNodes[i].children[0] === e){
            selectedIndex = i;  
            break;
        };
    }
    audio.src = list_song[selectedIndex]?.source;
}

function showmenus(event, el) {
    event.preventDefault();
    let x = event.offsetX + getOffset(el).left;
    let y = event.offsetY + getOffset(el).top;
    let index = 0;

    for (let i = 0; i < songs.childNodes.length; i++){
        if (songs.childNodes[i].children[0] === el){
            index = i;
            break;
        };
    }

    content_wrapper.removeAttribute('style');
    content_wrapper.style.left = `${x}px`;
    content_wrapper.style.top = `${y}px`;

    // delete menu
    document.querySelector('.items>li>span#delete').onclick = () => {
        audio.src = '';
        songs.removeChild(el.parentNode);
        list_song.splice(index);
    }

    // rename menu
    document.querySelector('.items>li>span#rename').onclick = () => {
        const rename_wrapper = document.querySelector('.rename-wrapper');
        const inputText = document.querySelector('.rename-wrapper>input[type="text"]');
        rename_wrapper.removeAttribute('style');
        inputText.onkeypress = event => {
            if ( event.keyCode === 13 ) {
                if ( inputText.value ) {
                    list_song[index].name = inputText.value;
                    el.textContent = inputText.value;
                    inputText.value = '';
                }
                rename_wrapper.setAttribute('style', 'display: none;');
            }
        }
    }
}

function getOffset( el ) {
    let _x = 0;
    let _y = 0;
    while ( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
          _x += el.offsetLeft - el.scrollLeft;
          _y += el.offsetTop - el.scrollTop;
          el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

autoplay_btn.onclick = () => {
    if (audio.autoplay) {
        audio.autoplay = false;
        autoplay_btn.setAttribute('style','text-decoration: line-through');
    } else {
        audio.autoplay = true;
        audio.play();
        autoplay_btn.removeAttribute('style');
    }
}

loop_btn.onclick = () => {
    if (looping) {
        looping = false;
        loop_btn.setAttribute('style','text-decoration: line-through');
    } else {
        looping = true;
        loop_btn.removeAttribute('style');
    }
}

audio.onplaying = () => console.log(`Playing (${songs.childNodes[selectedIndex].children[0].textContent})`);
audio.onended = () => {
    if (audio.autoplay && songs.childNodes.length - 1 > selectedIndex) {
        selectSong(songs.childNodes[selectedIndex + 1].children[0]);
    } else if (looping && selectedIndex >= songs.childNodes.length - 1) {
        selectSong(songs.childNodes[0].children[0]);
    } else {
        document.querySelectorAll(".selected-song").forEach(element => element.classList.remove("selected-song"));
        audio.src = null;
    }
};

document.querySelector('body').onclick = event => { 
    if (event.target !== ('.songs>li>span')) {
        content_wrapper.setAttribute('style', 'display: none;');
    }
}