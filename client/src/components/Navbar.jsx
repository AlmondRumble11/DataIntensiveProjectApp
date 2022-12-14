import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useLanguage } from '../context/languageContext';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useEffect } from 'react';
import { useShoppingCart } from '../context/shoppingCartContext';

//SOURCE FOR APP BAR: https://mui.com/components/app-bar/#basic-app-bar
const ResponsiveAppBar = () => {

    const context = useLanguage();
    let navigate = useNavigate();
    const { i18n, t } = useTranslation(["i18n"]);
    const shoppingCart = useShoppingCart();

    useEffect(() => {
        if (localStorage.getItem("i18nextLng")?.length > 2) {
            i18next.changeLanguage("en")
        }
    }, []);

    //Based on this boolean some pages are hidden from the user. For example when user is not logged in there is no reason to show logout button.
    let isLoggedIn = false;
    let isCountrySelected = false;

    // These useStates and functions are used to handle the closing and opening of the drop down menus
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
        context.setLanguage(lang);
        handleCloseNavMenu();
    };


    //When user log outs they are redirected to the login page
    const logOut = () => {
        sessionStorage.setItem('token', ''); //Clearing out the token from session storage
        shoppingCart.setItems([]); //Clears user shopping cart after logging out
        navigate(`/login`, { replace: true })
    };

    //Checking if the user is logged in. 
    if (sessionStorage.getItem('token')) {
        isLoggedIn = true
    }

    if (sessionStorage.getItem('countryCode')) {
        isCountrySelected = true
    }

    return (
        <AppBar position="static">

            <Container maxWidth="xl" >  {/* Container now grows to the full size of the screen */}
                <Toolbar disableGutters> {/* Gutters are set to false, so there wont be spaces between content's tracks*/}
                    {/* Name of the site and setting the first box to have flexgrow 1 so all the other components that come after it are on the right side*/}
                    <Box display='flex' flexGrow='1'>
                        <Typography variant="h6"
                            noWrap
                            component={RouterLink}
                            to='/'
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            NordicBooks
                        </Typography>
                    </Box>
                    {/* Defining the area/ box in which the links to pages are located. 'xs: flex' meaning that on xs screens the menu is shown and in others 'md: none' it is hidden*/}
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        {/* The haburger menu that is displayed on mobile */}
                        <IconButton size="small" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                            <MenuIcon />
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}>
                            {/* Listing menu items that are same as the normal desktop navigation*/}
                            <MenuItem component={RouterLink} to='/location' color="inherit" style={{ padding: '10px' }}>
                                {t('MyLocation')}
                            </MenuItem>
                            {isCountrySelected && <MenuItem component={RouterLink} to='/' color="inherit" style={{ padding: '10px' }}>
                                {t('Home')}
                            </MenuItem>}
                            {isCountrySelected && <MenuItem component={RouterLink} to='/allbooks' color="inherit" style={{ padding: '10px' }}>
                                {t('All books')}
                            </MenuItem>}
                            {!isLoggedIn && isCountrySelected && <MenuItem component={RouterLink} to='/login' color="inherit" style={{ padding: '10px' }}>
                                {t('Login')}
                            </MenuItem>}
                            {isLoggedIn && isCountrySelected && <MenuItem component={RouterLink} to='/profile' color="inherit" style={{ padding: '10px' }}>
                                {t('Profile')}
                            </MenuItem>}
                            {!isLoggedIn && isCountrySelected && <MenuItem component={RouterLink} to='/register' color="inherit" style={{ padding: '10px' }}>
                                {t('Register')}
                            </MenuItem>}
                            {isCountrySelected && <MenuItem component={RouterLink} to='/checkout' color="inherit" style={{ padding: '10px' }}>
                                {t('Checkout')}
                            </MenuItem>}
                            {
                                ["EN", "SE", "NO", "FI"].map(lang => {
                                    return (
                                        <Button key={lang} sx={{ color: context.language === lang ? "red" : "black" }} onClick={() => { handleLanguageChange(lang) }}>
                                            {lang}
                                        </Button>
                                    );
                                })
                            }
                            {isLoggedIn && isCountrySelected && <Button sx={{ color: "red" }} onClick={logOut}>
                                {t('Logout')}
                            </Button>}
                        </Menu>
                    </Box>
                    {/* Creating links to pages. Are shown in the desktop mode due to md beign flex and xs none meaning on extra small screens this is hidden*/}
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <MenuItem component={RouterLink} to='/location' color="inherit" style={{ padding: '10px' }} onClick={() => { handleCloseNavMenu() }}>
                            {t('MyLocation')}
                        </MenuItem>
                        {isCountrySelected && <MenuItem component={RouterLink} to='/' color="inherit" style={{ padding: '10px' }} onClick={() => { handleCloseNavMenu() }}>
                            {t('Home')}
                        </MenuItem>}
                        {isCountrySelected && <MenuItem component={RouterLink} to='/allbooks' color="inherit" style={{ padding: '10px' }} onClick={() => { handleCloseNavMenu() }}>
                            {t('All books')}
                        </MenuItem>}
                        {!isLoggedIn && isCountrySelected && <MenuItem component={RouterLink} to='/login' color="inherit" style={{ padding: '10px' }} onClick={() => { handleCloseNavMenu() }}>
                            {t('Login')}
                        </MenuItem>}
                        {isLoggedIn && isCountrySelected && <MenuItem component={RouterLink} to='/profile' color="inherit" style={{ padding: '10px' }} onClick={() => { handleCloseNavMenu() }}>
                            {t('Profile')}
                        </MenuItem>}
                        {!isLoggedIn && isCountrySelected && <MenuItem component={RouterLink} to='/register' color="inherit" style={{ padding: '10px' }} onClick={() => { handleCloseNavMenu() }}>
                            {t('Register')}
                        </MenuItem>}
                        {isCountrySelected && <MenuItem component={RouterLink} to='/checkout' color="inherit" style={{ padding: '10px' }} onClick={() => { handleCloseNavMenu() }}>
                            {t('Checkout')}
                        </MenuItem>}
                        {
                            ["EN", "SE", "NO", "FI"].map(lang => {
                                return (
                                    <Button key={lang} sx={{ color: context.language === lang ? "red" : "white" }} onClick={() => { handleLanguageChange(lang) }}>
                                        {lang}
                                    </Button>
                                );
                            })
                        }
                        {isLoggedIn && isCountrySelected && <Button sx={{ color: "red" }} onClick={logOut}>
                            {t('Logout')}
                        </Button>}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;
