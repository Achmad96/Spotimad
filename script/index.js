const songs = document.querySelector('.songs');
const audio = document.querySelector('audio');
const loop_btn = document.querySelector('#loop-btn');
const autoplay_btn = document.querySelector('#autoplay-btn');
const add_btn = document.querySelector('#add-btn');
const contextMenu = document.querySelector('.content-wrapper');
let looping = true;
var selectedIndex = 0;
var list_song = [];
audio.autoplay = true;

add_btn.onchange = () => {
    let file = document.querySelector('input[type=file]').files[0];
    if (file?.type === 'audio/mpeg'){
        let song = {
            name: file.name,
            source: (window.URL || window.webkitURL).createObjectURL(file)
        };
        let data = `<li><span onclick=selectSong(this) oncontextmenu=showmenus(event,this)>${song.name.slice(0,  song.name.length - 4)}</span></li>`;
        songs.insertAdjacentHTML('beforeend', data);
        list_song.push(song);
    } else alert(`${file.name} bukanlah sebuah lagu.`);
};

function selectSong(e) {
    document.querySelectorAll(".selected-song").forEach(element => element.classList.remove("selected-song"));
    contextMenu.setAttribute('style', 'display: none;')
    e.classList.add("selected-song");
    for (let i = 0; i < songs.childNodes.length; i++){
        if (songs.childNodes[i].children[0] === e){
            selectedIndex = i;
            break;
        };
    }
    audio.src = list_song[selectedIndex]?.source;
    if (audio.autoplay && audio.ended) audio.play();
}

function showmenus(event, el) {
    event.preventDefault();
    let x = event.offsetX + getOffset(el).left;
    let y = event.offsetY + getOffset(el).top;
    let removeIndex = 0;

    for (let i = 0; i < songs.childNodes.length; i++){
        if (songs.childNodes[i].children[0] === el){
            removeIndex = i;
            break;
        };
    }

    contextMenu.removeAttribute('style');
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;

    document.querySelector('ul.items>li>span#delete').onclick = () => {

        function removeSong(){
            if ( selectedIndex === removeIndex ) {
                audio.currentTime = 0;
                audio.pause();
            }
            (window.URL || window.webkitURL).revokeObjectURL(list_song[removeIndex].source);
            el.parentNode.removeChild(el);
            delete list_song[removeIndex];
            contextMenu.setAttribute('style', 'display: none;');
        }

        removeSong();
    }
}

function getOffset( el ) {
    let _x = 0;
    let _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
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
    if (songs.childNodes.length - 1 > selectedIndex) {
        selectedIndex++;
        selectSong(songs.childNodes[selectedIndex].children[0]);
    } else if (looping && selectedIndex >= songs.childNodes.length - 1) {
        selectSong(songs.childNodes[0].children[0]);
    } else {
        function unselectSongs() {
            document.querySelectorAll(".selected-song").forEach(element => element.classList.remove("selected-song"));
            audio.src = null;
        }
        unselectSongs();
    }
};

document.querySelector('body').onclick = event => { 
    if (event.target !== ('ul.songs>li>span')) contextMenu.setAttribute('style', 'display:none;');
}