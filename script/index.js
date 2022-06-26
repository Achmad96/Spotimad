const songs = document.querySelector('.songs');
const audio = document.querySelector('audio');
const loop_btn = document.querySelector('#loop-btn');
const add_btn = document.querySelector('#add-btn');
const content_wrapper = document.querySelector('.content-wrapper');
let looping = true;
var selectedIndex = 0;
var list_song = [];

add_btn.onchange = () => {
    let file = document.querySelector('input[type=file]').files[0];
    if (file?.type === 'audio/mpeg'){
        let song = {
            name: file.name.slice(0,  this.name.length - 4),
            source: (window.URL || window.webkitURL).createObjectURL(file)
        };
        let data = `<li onclick=selectSong(this) oncontextmenu=showContent(event,this)>${song.name}</li>`;
        songs.insertAdjacentHTML('beforeend', data);
        list_song.push(song);
        console.log(list_song);
    } else alert(`${file.name} bukanlah sebuah lagu.`);
};

function selectSong(el) {
    document.querySelectorAll(".selected-song").forEach(element => element.classList.remove("selected-song"));
    el.classList.add("selected-song");
    songs.childNodes.forEach((e, i) => {
        if (el === e) selectedIndex = i;
    });
    audio.src = list_song[selectedIndex]?.source;
}   

function showContent(event, el) {
    event.preventDefault();
    let x = event.offsetX + getOffset(el).left;
    let y = event.offsetY + getOffset(el).top;
    let index = 0;

    songs.childNodes.forEach((e, i) => {
        if (el === e) index = i;
    });

    content_wrapper.removeAttribute('style');
    content_wrapper.style.left = x + 'px';
    content_wrapper.style.top = y + 'px';

    // delete menu
    document.querySelector('.items>li>span#delete').onclick = () => {
        if (index === selectedIndex) audio.src = '';
        songs.removeChild(el);
        list_song.splice(index);
        console.log(list_song);
    }

    // rename menu
    document.querySelector('.items>li>span#rename').onclick = () => {
        const rename_wrapper = document.querySelector('.rename-wrapper');
        const inputText = document.querySelector('.rename-wrapper>input[type="text"]');
        const submit_btn = document.querySelector('#submit-btn');
        const close_btn = document.querySelector('#close-btn');
        rename_wrapper.removeAttribute('style');
        function changeName() {
            if ( inputText.value ) {
                list_song[index].name = inputText.value;
                el.textContent = inputText.value;
                inputText.value = '';
                rename_wrapper.setAttribute('style', 'display: none;');
            }
        }
        inputText.onkeypress = e => { if ( e.keyCode === 13 ) changeName(); }
        submit_btn.onclick = () => changeName();
        close_btn.onclick = () => {
            rename_wrapper.setAttribute('style', 'display: none;');
            inputText.value = '';
        }
    }
}

loop_btn.onclick = () => {
    looping = !looping;
    if ( !looping ) loop_btn.setAttribute('style', 'text-decoration: line-through');
    else loop_btn.removeAttribute('style');
}

audio.onended = () => {
    if (songs.childNodes.length - 1 > selectedIndex) {
        selectSong(songs.childNodes[selectedIndex + 1]);
        audio.play();
    } else if (looping && selectedIndex === songs.childNodes.length - 1) {
        selectSong(songs.childNodes[0])
        audio.play();
    } else {
        document.querySelectorAll(".selected-song").forEach(element => element.classList.remove("selected-song"));
        audio.src = '';
    }
};

document.querySelector('body').onclick = event => { 
    if (event.target !== ('.songs>li>span')) content_wrapper.setAttribute('style', 'display: none;');
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