import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./tickets.css"

export const TicketList = () => {
    const [tickets, setTickets] = useState([])
    const [filteredTickets, setFiltered] = useState([])
    const [emergency, setEmergency] = useState(false) /*Default state is false. Will be set to true on button click */
    const navigate = useNavigate()

    const localHoneyUser = localStorage.getItem("honey_user")
    const honeyUserObject = JSON.parse(localHoneyUser)

    useEffect(
        () => {
            if (emergency) {
                const emergencyTickets = tickets.filter(ticket => ticket.emergency === true)
                setFiltered(emergencyTickets)
                /*This will show emergency tickets if the emergency property on the ticket is true. The setFiltered function is used because only employees should be able to see this */
            } else {
                setFiltered(tickets)
            }
        },
        [emergency]
    )

    useEffect(
        () => {
            fetch(`http://localhost:8088/serviceTickets`)
                .then(response => response.json())
                .then((ticketArray) => {
                    setTickets(ticketArray)
                })

        },
        [] // When this array is empty, you are observing initial component state
    )

    useEffect(
        () => {
            if (honeyUserObject.staff) {
                setFiltered(tickets) //For employees
            } else {
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id) //For customers
                setFiltered(myTickets)
            }
        },
        [tickets]
    )

    return <>
        {
            honeyUserObject.staff
                ? <>
                <button onClick={() => { setEmergency(true) }}>Emergency Only</button> 
                <button onClick={() => { setEmergency(false) }}>Show All</button> 
                </>
                : 
                <button onClick={() => navigate("/ticket/create")}>Create Ticket</button>
        }
        <h2>List of Tickets</h2>

        <article className="tickets">
            {
                filteredTickets.map(
                    /*This initially mapped through "tickets" array, but now that the filteredTickets have been added to line 6, it needed to be changed to map through filteredTickets array */
                    (ticket) => {
                        return <section className="ticket">
                            <header>{ticket.description}</header>
                            <footer>Emergency: {ticket.emergency ? "Yes" : "No"}</footer>
                        </section>
                    }
                )
            }
        </article>
    </>

}