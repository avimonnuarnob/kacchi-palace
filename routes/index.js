const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const { catchErrors } = require('../handlers/errorHandlers');
// Do work here
router.get('/',catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));
router.get('/add', authController.isLoggedin, storeController.addStore);
router.post('/add', 
    storeController.upload, 
    catchErrors(storeController.resize), 
    catchErrors(storeController.createStore)
);
router.post('/add/:id',
    storeController.upload,
    catchErrors(storeController.resize),  
    catchErrors(storeController.updateStore)
);
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

router.get('/stores/:slug', catchErrors(storeController.getStoreBySLug))

router.get('/tags', catchErrors(storeController.getStoresByTag))
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag))

router.get('/login', userController.loginForm)
router.get('/register', userController.registerForm)
router.post('/register', 
    userController.valdateRegister,
    userController.register,
    authController.login
)

router.get('/logout', authController.logout)

router.post('/login', authController.login)

router.get('/account', authController.isLoggedin , userController.account)
router.post('/account', catchErrors(userController.updateAccount))

router.post('/account/forgot', catchErrors(authController.forgot))

router.get('/account/reset/:token', catchErrors(authController.reset))
router.post('/account/reset/:token', 
    authController.confirmedPassword, 
    catchErrors(authController.update)
)
router.get('/map', storeController.mapPage)



router.get('/api/search', catchErrors(storeController.searchStores))
router.get('/api/stores/near', catchErrors(storeController.mapStores))
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore))

router.get('/hearts', authController.isLoggedin, catchErrors(storeController.getHearts))

router.post('/reviews/:id', authController.isLoggedin, catchErrors(reviewController.addReview))

router.get('/top', catchErrors(storeController.getTopStores))

module.exports = router;
