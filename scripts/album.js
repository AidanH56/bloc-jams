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

 //create a method that can change 
 //the current song's playback location.
 var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }
 
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
             currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
             updateSeekBarWhileSongPlays();

             //set the CSS of the volume seek bar to equal the currentVolume
             
             //establish variables that call volume and necessary classes
             var $volumeFill = $('.volume .fill');
             var $volumeThumb = $('.volume .thumb');

             //update CSS of volum seek bar
             $volumeFill.width(currentVolume + '%');
             $volumeThumb.css({left: currentVolume + '%'});

             $(this).html(pauseButtonTemplate);
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

 var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
        
         // #10
         // we bind() the timeupdate event to currentSoundFile. 
         //timeupdate is a custom Buzz event that fires repeatedly 
         //while time elapses during song playback.
         currentSoundFile.bind('timeupdate', function(event) {
             
             // #11
             //We use Buzz's getTime() method to get the current time of 
             //the song and the getDuration() method for getting the total 
             //length of the song. Both values return time in seconds.
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });

         /* Assignment 33 Part 1 */
         var setCurrentTimeInPlayerBar = function(currentTime) {

          // set the text of the element with the 
          //.current-time class to the current time in the song.
          if($(this).parent().attr('class') === '.current-time'){
                

          }
         }

     }
 };

  var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
   
    //make sure our percentage isn't less than zero
    offsetXPercent = Math.max(0, offsetXPercent);

    //make sure it doesn't exceed 100.
    offsetXPercent = Math.min(100, offsetXPercent);

    //convert our percentage to a string and add the % character
    var percentageString = offsetXPercent + '%';

    //the CSS interprets the value as a percent instead 
    //of a unit-less number between 0 and 100.
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

  var setupSeekBars = function() {

    //find all elements in the DOM with a class of 
    //"seek-bar" that are contained within the element 
    //with a class of "player-bar"
     var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {
         
         // #3
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         
         // #4
         //we divide offsetX by the width of the 
         //entire bar to calculate seekBarFillRatio.
         var seekBarFillRatio = offsetX / barWidth;

         //If it's the playback seek bar, seek to the position 
         //of the song determined by the seekBarFillRatio
         if($(this).parent().attr('class') === 'seek-control'){
            
            seek(seekBarFillRatio * currentSoundFile.getDuration())
         
         } else {
            
            setVolume(seekBarFillRatio * 100);   

            }
 
         // #5
         //we pass $(this) as the $seekBar argument and 
         //seekBarFillRatio for its eponymous argument to 
         //updateSeekBarPercentage().
         updateSeekPercentage($(this), seekBarFillRatio);
     });

     //find elements with a class of .thumb inside our $seekBars 
     //and add an event listener for the mousedown event
     $seekBars.find('.thumb').mousedown(function(event) {

         // #8
         //we are taking the context of the event and wrapping it 
         //in jQuery. In this scenario, this will be equal to the 
         //.thumb node that was clicked.
         var $seekBar = $(this).parent();
 
         // #9
         //of wrapping the event in a method like we've seen with 
         //all other jQuery events thus far.
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;

             if ($seekBar.parent().attr('class') == 'seek-control') {
                
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
           
            } else {
                
                setVolume(seekBarFillRatio);

}
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         // #10
         //we bind the mouseup event with a .thumb namespace. 
         //The event handler uses the unbind() event method, 
         //which removes the previous event listeners that we 
         //just added. If we fail to unbind() them, the thumb 
         //and fill would continue to move even after the user 
         //released the mouse.
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
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

$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     setupSeekBars();
     $previousButton.click(prevSong);
     $nextButton.click(nextSong);
     playerBarActions.click(togglePlayFromPlayerBar);
});