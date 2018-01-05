$(document).ready( function () {
  var imgPost = null;
	var database = firebase.database();
  var userConnect = null;

	$('#submit_register').click(function () {
		var email = $('#email').val();
		var password = $('#password').val();
		if (password.length >= 6) {
			firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(function () {
					verify();
			})
			.catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // ...
		});
		$('#modalRegister').html('<div class="modal-dialog"><!-- Modal content--><div class="modal-content register-form"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title"><h5 class="text-uppercase bold text-center">Registro Completado</h5></div><div class="content"><div class="modal-body"><!-- Mensaje Registro Exitoso --><h4>Su registro se ha realizado con éxito. Recibirá un correo de verificación.</h4><button type="button" data-dismiss="modal" class="btn btn-primary btn-send text-uppercase">Cerrar</button></form></div></div></div></div>');
		}
		else {
			alert('Email: Ingrese un correo válido. \nContraseña: debe tener al menos 6 caracteres.');
		}
	});
	$('#submit_login').click( function () {
		var emailLogin = $('#email_login').val();
		var passwordLogin = $('#pwd_login').val();
		firebase.auth().signInWithEmailAndPassword(emailLogin, passwordLogin).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // ...
		});
	})	

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    // User is signed in.
	    var displayName = user.displayName;
	    var email = user.email;
	    var emailVerified = user.emailVerified;
	    var photoURL = user.photoURL;
	    var isAnonymous = user.isAnonymous;
	    var uid = user.uid;
	    var providerData = user.providerData;
	    console.log(user);
      // Guardar info del usuario a la BD

      userConnect = database.ref("/user");

      function addUserBD (uid,name) {
        var connected = userConnect.push({
          uid:uid,
          name:name
        });
      }

	    if (emailVerified) {
	    	// Si el usuario esta verificado, puede acceder al contenido
	  		showContentUsers();
        addUserBD (user.uid,user.displayName);
	  	}

	    function showContentUsers() {
        // Cambio Menu Principal
        $('#menu-user').html('<li><a href="#"><button type="button" class="btn btn-default text-uppercase" id="show-profile">ver Perfil</button></a></li><li><a href="#"><button type="button" class="btn btn-default text-uppercase" id="close_session">Cerrar Sesión</button></a></li>');
	    	// Se fuerza al usuario a ingresar sus datos
	    	if (displayName == null && photoURL == null) {
	    		$('#register_users').html('<div class="row welcome"><h3>Para continuar y disfrutar de todas las maravillas de LoveinFood, debes completar tu información de perfil</h3><form><div class="form-group"><label for="">Nombre Completo (Obligatorio) *</label><input id="fullname" class="form-control" type="text" placeholder="Ejemplo: Pablo Pérez"></div><div class="form-group"><label for="">Foto de Perfil (Obligatorio) *</label><input id="urlphoto" class="form-control" type="text"  placeholder="http://www.ejemplo.com/photo.jpg"></div><p>Verifica que toda la información solicitada esta correcta. Una vez enviada no se puede modificar</p><button id="completeprofile" type="button" class="btn btn-default btn-send text-uppercase">Enviar Información de Perfil</button></form></div>');
	    		$('#completeprofile').click(function () {
	    			var user = firebase.auth().currentUser;

						user.updateProfile({
  					displayName: $('#fullname').val(),
	    			photoURL: $('#urlphoto').val()
						}).then(function() {
  						// Update successful.
  						console.log('Actualizacion exitosa');
						}).catch(function(error) {
  						// An error happened.
						});
            location.reload();
	    		})
				}
	    	else {
	    		$('#register_users').html('<div class="welcome row"><div class="col-xs-4 col-md-1"><img src="'+photoURL+'" alt="" class="img-thumbnail"></div><div class="col-xs-8 col-md-8"><h3>Bienvenid@ '+displayName+'</h3>');
          // Para ver perfil de usuario
          $('#show-profile').click(function () {
            $('.intro').hide();
            $('.trending-pics').hide();
            $(".maincontent").css("position", "static");
            $(".welcome").css("background-color", "#3c434a");
            $(".welcome").css("color", "#fff");
            $(".welcome").html('<div class="col-xs-4 col-md-2"><img src="'+photoURL+'" alt="" class="img-thumbnail"></div><div class="col-xs-8 col-md-10"><h3>'+displayName+' <span class="hidden-xs pull-right"><i class="fa fa-star fa-lg" aria-hidden="true"></i><i class="fa fa-star fa-lg" aria-hidden="true"></i><i class="fa fa-star fa-lg" aria-hidden="true"></i><i class="fa fa-star fa-lg" aria-hidden="true"></i><i class="fa fa-star-o fa-lg" aria-hidden="true"></i></span></h3><div class="row text-center"><div class="col-xs-4 col-md-4"><h4>Publicaciones</h4><h3>22</h3></div><div class="col-xs-4 col-md-4"><h4>Recetas</h4><h3>5</h3></div><div class="col-xs-4 col-md-4"><h4>Listas</h4><h3>2</h3></div></div></div>');
            $('#register_users').append(
              '<div class="row profile-content"><div class="col-xs-12 col-md-8 text-center"><h2 class="lobster">¿Que quieres hacer hoy?</h2><div class="row"><div class="col-xs-4 col-md-4"><button class="newchoose" id="new_post">Publicar</button></div><div class="col-xs-4 col-md-4"><button class="newchoose" id="new_recipe">Subir receta</button></div><div class="col-xs-4 col-md-4"><button class="newchoose" id="new_list">Nueva Lista</button></div><div class="col-md-12" id="show-content"></div><div id="posts"></div></div></div><div class="col-xs-12 col-md-4 aside"><div class="friends-box"><h3 class="text-uppercase text-center poppins">Amigos</h3><div class="friend-pics"><img src="assets/img/profile/user0.jpg" alt="" class="img-responsive"></div><div class="friend-pics"><img src="assets/img/profile/user1.jpg" alt="" class="img-responsive"></div><div class="friend-pics"><img src="assets/img/profile/user2.jpg" alt="" class="img-responsive"></div><div class="friend-pics"><img src="assets/img/profile/user3.jpg" alt="" class="img-responsive"></div><div class="friend-pics"><img src="assets/img/profile/user4.jpg" alt="" class="img-responsive"></div><div class="friend-pics"><img src="assets/img/profile/user5.jpg" alt="" class="img-responsive"></div> <div class="friend-pics"><img src="assets/img/profile/user6.jpg" alt="" class="img-responsive"></div><div class="friend-pics"><img src="assets/img/profile/user7.jpg" alt="" class="img-responsive"></div><div class="friend-pics"><img src="assets/img/profile/user8.jpg" alt="" class="img-responsive"></div></div><div class="pages-follow"><h3 class="poppins text-uppercase text-center">Sugerencias</h3><ul><li><a href="#">Gordon Ramsay</a> <button class="btn-follow">Seguir</button></li><li><a href="#">Jamie Oliver</a> <button class="btn-follow">Seguir</button></li> <li><a href="#">Rachel Ray</a> <button class="btn-follow">Seguir</button></li><li><a href="#">Mario Batali</a> <button class="btn-follow">Seguir</button></li><li><a href="#">Giada De Laurentiis</a> <button class="btn-follow">Seguir</button class="btn-follow"></li><li><a href="#">Ferran Adrià</a> <button class="btn-follow">Seguir</button class="btn-follow"></li></ul></div></div></div>');
            $('#new_post').click( function () {
              $('#show-content').html('<form><div class="form-group"><label class="control-label pull-left">Título:</label><input type="txt" class="form-control" id="title_post" placeholder="Mi Sandwich favorito"></div><div class="form-group"><label class="control-label pull-left">Descripción:</label><textarea name="" id="textarea_post" cols="30" rows="10"></textarea></div> <div id="preview" class="thumbnail"><a href="#" id="file-select" class="btn btn-default">Elegir archivo</a><img src="assets/img/upload_file.png"/></div><form id="file-submit" enctype="multipart/form-data"><input id="file" name="file" type="file"/></form><a href="#" class="btn btn-primary" id="post-save">Enviar Publicación</a></form><div id="posts"></div>');

            $('#preview').hover(
               function() {
              $(this).find('a').fadeIn();
             }, function() {
              $(this).find('a').fadeOut();
            }
            )
            $('#file-select').on('click', function(e) {
              e.preventDefault();
    
             $('#file').click();
            })

            $('input[type=file]').change(function() {
              var file = (this.files[0].name).toString();
              var reader = new FileReader();
    
              $('#file-info').text('');
              $('#file-info').text(file);
    
              reader.onload = function (e) {
                imgPost = e.target.result;
                $('#preview img').attr('src', e.target.result);
           }
     
            reader.readAsDataURL(this.files[0]);
            });

           $('#post-save').click( function () {
            var titlePost
            var textPost
            var 
            imgPost; // url imagen
            


           });

          })

            $('#new_recipe').click( function () {
              $('#show-content').html('<h3>En desarrollo...</h3>');
            })

            $('#new_list').click( function () {
              $('#show-content').html('<h3>En desarrollo...</h3>');
            })
          });
	    	}
	    	
	    };

	    $('#close_session').click( function () {
	    	console.log('Cerraste la sesion');
	    	firebase.auth().signOut().then(function() {
		  		// Sign-out successful.
		  		location.reload();
					}).catch(function(error) {
		  		// An error happened.
				});
	    });
	    // ...
	    console.log('Existe usuario activo');
	    
	  } else {
	    // User is signed out.
	    // ...
	    console.log('No existe usuario activo');
	  }
	});

	function verify() {
	 	var user = firebase.auth().currentUser;
		user.sendEmailVerification().then(function() {
  		// Email sent.
		}).catch(function(error) {
  		// An error happened.
  		console.log(error);
			});
	  }
	})

	$('#forgetpwd').click(function () {
		var auth = firebase.auth();
		var emailAddress = prompt('Ingresa tu correo');
		auth.sendPasswordResetEmail(emailAddress).then(function() {
  	// Email sent.
		}).catch(function(error) {
  // An error happened.
	});


  // Funcion para redimensionar el textarea
  $('textarea').keydown( function () {
    var element = $(this);
    setTimeout(function(){
      element.style.cssText = 'height:auto; padding:3px';
      element.style.cssText = 'height:' + element.scrollHeight + 'px';
    },0);
  });          
})