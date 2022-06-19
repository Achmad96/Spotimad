let songs = document.querySelector('.songs');
let audio = document.querySelector('audio');
let loop_btn = document.querySelector('#loop-btn');
let auto_btn = document.querySelector('#auto-btn');
let add_btn = document.querySelector('#add-btn');
let looping = true;
var index = 0;
var list_song = [];
audio.autoplay = true;

add_btn.onchange = () => {
    let file = document.querySelector('input[type=file]').files[0];
    if (file.type === 'audio/mpeg'){
        let song = {
            name: '',
            source: null 
        };
        let song_names = file.name.split('.');
        for (let i = 0; i < song_names.length - 1; i++){
            song.name += song_names[i] + '.';
        }
        let data = `<li><span onclick=selectSong(this)>${song.name}</span></li>`;
        songs.insertAdjacentHTML('beforeend', data);
        song.source = (window.URL || window.webkitURL).createObjectURL(file);
        list_song.push(song);
    } else alert(`${file.name} bukanlah sebuah lagu.`);
};

function selectSong(e){
    document.querySelectorAll(".selected-song").forEach(element => element.classList.remove("selected-song"));
    e.classList.add("selected-song");
    for (let i = 0; i < songs.childNodes.length; i++){
        if (songs.childNodes[i].children[0] === e){
            index = i;
            break;
        };
    }
    audio.src = list_song[index].source;
    if (audio.autoplay && audio.ended) audio.play();
}

auto_btn.onclick = () => {
    if (audio.autoplay) {
        audio.autoplay = false;
        auto_btn.setAttribute('style','text-decoration: line-through');
    } else {
        audio.autoplay = true;
        audio.play();
        auto_btn.removeAttribute('style');
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

audio.onplaying = () => console.log('Playing ' + songs.childNodes[index].children[0].textContent);
audio.onended = () => {
    if (songs.childNodes.length - 1 > index) {
        index++;
        selectSong(songs.childNodes[index].children[0]);
    } else if (looping && index >= songs.childNodes.length - 1) selectSong(songs.childNodes[0].children[0]);   
};