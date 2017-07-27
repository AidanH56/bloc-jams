var setSong = function(songNumber) {
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {

         formats: [ 'mp3' ],
         preload: true
     });

     setVolume(currentVolume);
 };
 
 var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };


var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

      var $row = $(template);

     var clickHandler = function() {
         var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
       
             var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
             currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
             currentlyPlayingCell.html(currentlyPlayingSongNumber);
         }
         if (currentlyPlayingSongNumber !== songNumber) {

             setSong(songNumber);
             currentSoundFile.play();
             $(this).html(pauseButtonTemplate);
             currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
             updatePlayerBarSong();

         } else if (currentlyPlayingSongNumber === songNumber) {

             if (currentSoundFile.isPaused()) {
               $(this).html(pauseButtonTemplate);
               $('.main-controls .play-pause').html(playerBarPauseButton);
               currentSoundFile.play();
           } else {
               $(this).html(playButtonTemplate);
               $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();   
            }

                  }
     };


     var onHover = function(event) {
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.attr('data-song-number'));

         if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
         }

     };
     var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
            }
     };
 

     $row.find('.song-item-number').click(clickHandler);

     $row.hover(onHover, offHover);

     return $row;
};

 var setCurrentAlbum = function(album) {
     // #1
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     // #3
     $albumSongList.empty();
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };


 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

 var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    var lastSongNumber = currentlyPlayingSongNumber;

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var prevSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    var lastSongNumber = currentlyPlayingSongNumber;

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

 var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .song-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

    $('.main-controls .play-pause').html(playerBarPauseButton);
 };


var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }  
};

var clickHandler = function(targetElement) {
    var songItem = getSongItem(targetElement); 

    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
     } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
     } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }
 };

 //Write a function so that users can play 
 //and pause a song from the bar. Takes no arguments

 var togglePlayFromPlayerBar = function() {

    //If a song is paused and the play button 
    //is clicked in the player bar, it will

    if(currentSoundFile.isPaused()) {
        //Change the song number cell from a play button to a pause button
        $(this).html(pauseButtonTemplate);

        //Change the HTML of the player bar's play button to a pause button
        playPause.html(playerBarPauseButton);

        //Play the song
        currentSoundFile.play();
    } 

    //If the song is playing (so a current sound file exist), 
    //and the pause button is clicked

    else {
        //Change the song number cell from a pause button to a play button
        $(this).html(playButtonTemplate);

        //Change the HTML of the player bar's pause button to a play button
        playPause.html(playerBarPlayButton);

        //Pause the song
        currentSoundFile.Pause();
    }

 };

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;

var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var playPause = $('.main-controls .play-pause');

$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(prevSong);
     $nextButton.click(nextSong);
     //add a click() event for $playPause in this block with
     //togglePlayFromPlayerBar() as an event handler
     playPause.click(togglePlayFromPlayerBar);
});