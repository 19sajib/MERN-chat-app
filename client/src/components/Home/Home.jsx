import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Typography } from '@material-ui/core'
import { isAuthenticated } from '../../auth/auth'
const Home = () => {
    const { user } = isAuthenticated()
    return (
            user ?( 
            <Button component={Link} to="/chat-dashboard" variant="contained" color="primary" >
                Chat Dashbord
            </Button>) : (
              <Typography variant="h6" >Please Log in, then you see the chat dashborad button!</Typography>  
            )

    )
}

export default Home
