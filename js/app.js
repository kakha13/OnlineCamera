   const player = document.getElementById('player');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const captureButton = document.getElementById('capture');
    let flipBtn = document.querySelector('#change');

    let defaultsOpts = {
        audio: false,
        video: true
    }
    let shouldFaceUser = true;

    // check whether we can use facingMode
    let supports = navigator.mediaDevices.getSupportedConstraints();
    if (supports['facingMode'] === true) {
        flipBtn.disabled = false;
    }

    let stream = null;

    function capture() {
        defaultsOpts.video = {
            facingMode: shouldFaceUser ? 'user' : 'environment'
        }
        navigator.mediaDevices.getUserMedia(defaultsOpts)
            .then(function(_stream) {
                stream = _stream;
                player.srcObject = stream;
                player.play();
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    flipBtn.addEventListener('click', function() {
        $("#canvas").hide();
        $("#player").show();

        if (stream == null) return
            // we need to flip, stop everything
        stream.getTracks().forEach(t => {
            t.stop();
        });
        // toggle / flip
        shouldFaceUser = !shouldFaceUser;
        capture();
    })
    const constraints = {
        video: true,
    };

    captureButton.addEventListener('click', () => {
        canvas.width = player.clientWidth / 2;
        canvas.height = player.clientHeight / 2;
        // Draw the video frame to the canvas.
        context.drawImage(player, 0, 0, canvas.width, canvas.height);

        window.dataURL = canvas.toDataURL('image/png');
       
	    $(".imageHere").show(); // insert image from server
	    $(".imageHere").html("<img href='" + window.dataURL + "' src='" + window.dataURL + "'/>"); 
		// image PopUp
		$('.imageHere img').magnificPopup({
			type: 'image'
		});
    });

    // Attach the video stream to the video element and autoplay.
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            player.srcObject = stream;
        });

    navigator.getWebcam = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
                audio: false,
                video: true
            })
            .then(function(stream) {
                player.srcObject = stream;
            })
            .catch(function(e) {
                logError(e.name + ": " + e.message);
            });
    } else {
        navigator.getWebcam({
                audio: false,
                video: true
            },
            function(stream) {
                player.srcObject = stream;
            },
            function() {
                logError("Web cam is not accessible.");
            });
    }

    $("#player").on("resize", function() {
        const width = $("#player").width();
        const height = $("#player").height();
        $("#canvas").css("width", width);
        $("#canvas").css("height", height);
    });

    // download
    // image upload server
    function to_image() {
        $("#loader").show();
        $.ajax({
            type: "POST",
            url: "https://any.ge/photo/script.php",
            data: {
                imgBase64: dataURL
            },
            error: function(xhr, error) {
                console.debug(xhr);
                console.debug(error);

                $("#loader").hide();
            },

        }).done(function(o) {
			$(".logs").html("<a href='"+o+"' target='_blank'>"+o+"</a>");
			$(".logs").fadeIn();
			setTimeout(function(){
				$(".logs").fadeOut();
			}, 5000);
			
            $(".imageHere").append('<i class="material-icons">check</i>'); // show loader
           
            $("#loader").hide(); // hide loader


        });

    }
    capture();