$(document).ready( function () {
	var database = firebase.database();

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
	    if (emailVerified) {
	    	// Si el usuario esta verificado, puede acceder al contenido
	  		showContentUsers();
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
	    		$('#register_users').html('<div class="welcome row"><div class="col-xs-4 offset-md-2 col-md-2"><img src="'+photoURL+'" alt="" class="img-thumbnail"></div><div class="col-xs-8 col-md-8"><h3>Bienvenid@ '+displayName+'</h3><p class="hidden-xs">Ultima Conexión: '+Date()+'</p></div>');
          // Para ver perfil de usuario
          $('#show-profile').click(function () {
            $('.intro').hide();
            $(".maincontent").css("position", "static")
            
          })
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
})