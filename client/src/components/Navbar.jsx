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
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

//SOURCE FOR APP BAR: https://mui.com/components/app-bar/#basic-app-bar


const ResponsiveAppBar = () => {

    let navigate = useNavigate(); 

    //Based on this boolean some pages are hidden from the user. For example when user is not logged in there is no reason to show logout button.
    var isLoggedIn = false;

    // These useStates and functions are used to handle the closing and opening of the drop down menus
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const changeLanguage = (lang) => {
        console.log(lang);
        handleCloseNavMenu();
     
      
    };
    //When user log outs they are redirected to the login page
    const logOut = () => {
        console.log("Log out");
        sessionStorage.setItem('token', ''); //Clearing out the token from session storage
        navigate(`/login`, { replace: true })
    };

    //Checking if the user is logged in. 
    if(sessionStorage.getItem('token')){
        isLoggedIn = true
    }

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(1),
          width: 'auto',
        },
      }));
      
      const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }));
      const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
          padding: theme.spacing(1, 1, 1, 0),
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
          transition: theme.transitions.create('width'),
          width: '100%',
          [theme.breakpoints.up('sm')]: {
            width: '500px',
            '&:focus': {
              width:'500px',
            },
          },
        },
      }));

    return (
        <AppBar position="static">
        <Container maxWidth="xl" >  {/* Container now grows to the full size of the screen */}
            <Toolbar disableGutters> {/* Gutters are set to false, so there wont be spaces between content's tracks*/}
            {/* Name of the site and setting the first box to have flexgrow 1 so all the other components that come after it are on the right side*/}
            <Box display='flex' flexGrow='1'>
                <Typography  variant="h6"
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
            <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
                {/* Defining the area/ box in which the links to pages are located. 'xs: flex' meaning that on xs screens the menu is shown and in others 'md: none' it is hidden*/}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                {/* The haburger menu that is displayed on mobile */}
                <IconButton size="small" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                    <MenuIcon />
                </IconButton>
                
                <Menu 
                    id="menu-appbar" 
                    anchorEl={anchorElNav} 
                    anchorOrigin={{vertical: 'bottom', horizontal: 'left',}} 
                    keepMounted 
                    transformOrigin={{ vertical: 'top', horizontal: 'left'}} 
                    open={Boolean(anchorElNav)} 
                    onClose={handleCloseNavMenu} 
                    sx={{ display: { xs: 'block', md: 'none' }}}>
                    {/* Listing menu items that are same as the normal desktop navigation*/}
                    <MenuItem component={RouterLink} to='/' color="inherit" style={{padding: '10px'}}>
                        Home
                    </MenuItem>
                    <MenuItem component={RouterLink} to='/allbooks' color="inherit" style={{padding: '10px'}}>
                            Allbooks
                    </MenuItem>
                    <MenuItem component={RouterLink} to='/login' color="inherit" style={{padding: '10px'}}>
                            Login
                    </MenuItem>
                    <MenuItem component={RouterLink} to='/profile' color="inherit" style={{padding: '10px'}}>
                            Profile
                    </MenuItem>
                    <MenuItem component={RouterLink} to='/register' color="inherit" style={{padding: '10px'}}>
                            Register
                    </MenuItem>
                    <MenuItem component={RouterLink} to='/checkout' color="inherit" style={{padding: '10px'}}>
                            Checkout
                    </MenuItem>
                    <Button sx={{color:"inherit"}} onClick={() => {changeLanguage("EN")}}>
                    EN
                </Button>
                <Button sx={{color:"inherit"}} onClick={() => {changeLanguage("SWE")}}>
                    SWE
                </Button>
                <Button sx={{color:"inherit"}} onClick={() => {changeLanguage("NO")}}>
                    NO
                </Button>
                <Button sx={{color:"inherit"}} onClick={() => {changeLanguage("FI")}}>
                    FI
                </Button>
                <Button sx={{color:"red"}} onClick={logOut}>
                    Logout
                </Button>
                </Menu>
            </Box>
            {/* Creating links to pages. Are shown in the desktop mode due to md beign flex and xs none meaning on extra small screens this is hidden*/}
            <Box  sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem component={RouterLink} to='/' color="inherit" style={{padding: '10px'}}onClick={() => {handleCloseNavMenu()}}>
                        Home
                </MenuItem>
                <MenuItem component={RouterLink} to='/allbooks' color="inherit" style={{padding: '10px'}} onClick={() => {handleCloseNavMenu()}}>
                        Allbooks
                </MenuItem>
                <MenuItem component={RouterLink} to='/login' color="inherit" style={{padding: '10px'}} onClick={() => {handleCloseNavMenu()}}>
                        Login
                </MenuItem>
                <MenuItem component={RouterLink} to='/profile' color="inherit" style={{padding: '10px'}} onClick={() => {handleCloseNavMenu()}}>
                        Profile
                </MenuItem>
                <MenuItem component={RouterLink} to='/register' color="inherit" style={{padding: '10px'}}  onClick={() => {handleCloseNavMenu()}}>
                        Register
                </MenuItem>
                <MenuItem component={RouterLink} to='/checkout' color="inherit" style={{padding: '10px'}} onClick={() => {handleCloseNavMenu()}}>
                        Checkout
                </MenuItem>
                <Button sx={{color:"inherit"}} onClick={() => {changeLanguage("EN")}}>
                    EN
                </Button>
                <Button sx={{color:"inherit"}} onClick={() => {changeLanguage("SWE")}}>
                    SWE
                </Button>
                <Button sx={{color:"inherit"}} onClick={() => {changeLanguage("NO")}}>
                    NO
                </Button>
                <Button sx={{color:"inherit"}} onClick={() => {changeLanguage("FI")}}>
                    FI
                </Button>
                <Button sx={{color:"red"}} onClick={logOut}>
                    Logout
                </Button>
            </Box>
            </Toolbar>
        </Container>
        </AppBar>
    );
    };
export default ResponsiveAppBar;
