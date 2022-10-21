import { Link } from "react-router-dom"

export const Ticket = ({ ticketObject, currentUser, employees }) => {

    let assignedEmployee= null
    if (ticketObject.employeeTickets.length > 0) {
        const ticketEmployeeRelationship = ticketObject.employeeTickets[0]
        assignedEmployee = employees.find(employee => employee.id === ticketEmployeeRelationship.employeeId)
    }

    return <section className="ticket">
        <header>
            {
                currentUser.staff
                    ? `Ticket ${ticketObject.id}`
                    : <Link to={`/tickets/${ticketObject.id}/edit`}>Ticket {ticketObject.id}</Link>
            }
        </header>
        <section>{ticketObject.description}</section>
        <section>Emergency: {ticketObject.emergency ? "🧨" : "No"}</section>
        <footer>
            {
                ticketObject.employeeTickets.length
                    ? `Currently being worked on by ${assignedEmployee !== null ? assignedEmployee.user.fullName : ""}`
                    : <button
                        onClick={() => {
                            fetch(`http://localhost:8088/employeeTickets`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    employeeId: currentUser.id,
                                    serviceTicketId: ticketObject.id
                                })
                            })
                        }}
                    >Claim</button>
        }
        </footer>
    </section>
}