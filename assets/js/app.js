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
			alert('La contraseña debe tener al menos 6 caracteres');
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
	    	// Se fuerza al usuario a ingresar sus datos
	    	if (displayName == null && photoURL == null) {
	    		$('#register_users').html('<h3>Para continuar, completa la informacion de tu perfil<h3><div><input type="text" id="fullname" placeholder="Nombre Completo"></div><div><input type="text" id="urlphoto" placeholder="http://www.ejemplo.com/photo.jpg"></div><button type="button" id="completeprofile">Actualizar</button>');
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
	    		})
				}
	    	else {
	    		$('#register_users').html('<h1>Bienvenido '+displayName+'</h1><div><img src="'+photoURL+'"></div><button type="button" class="text-uppercase" id="close_session">Cerrar Sesión</button>');
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
  		console.log('Enviando correo...');
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