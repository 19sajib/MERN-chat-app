import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@material-ui/core'

const Home = () => {
    return (
        <div>
            <Button component={Link} to="/chatDashboard" variant="contained" color="primary" >
                Chat Dashbord
            </Button>
        </div>
    )
}

export default Home
