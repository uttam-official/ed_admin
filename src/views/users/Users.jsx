import axios from 'axios';
import CommonHeader from 'components/Headers/CommonHeader';
import BuildPagination from 'components/Paginations/BuildPagination';
import React, { useState, useEffect } from 'react'
import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Table,
    Container,
    Row,
    UncontrolledTooltip,
} from "reactstrap";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Users = () => {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjlkNGM4ZDI5NzY3MzY3NDg3ZjU4M2MiLCJ1c2VyUm9sZSI6InNlcnZpY2VfcHJvdmlkZXIiLCJpYXQiOjE3MzAzNzU1MDIsImV4cCI6MTczMDM3OTEwMn0.xF_MIESvjQLzePV3berMpjAFucvIeOrdjQMYlgOJqkA"

    const fetchUsers = async () => {
        try {
            let res = await axios.get(`http://127.0.0.1:8050/api/v1/auth/users?limit=20&page=${currentPage}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            setUsers(res.data.data.users)
            setTotalPages(res.data.data.totalPages)
        } catch (error) {
            console.log(error.message);
        }
    }
    // Fetch users data
    useEffect(() => {
        fetchUsers()
    }, [currentPage])


    const statuses = { 1: "active", 0: "inactive", 2: "Profile completion pending", 3: "verification pending", 4: "banned", 5: "self de-activation" }
    const roles = { 'user': "User", 'admin': "Admin", "service": "Service provider" }


    const changeStatus = async (status, user_id) => {
        try {
            let res = await axios.patch(`http://127.0.0.1:8050/api/v1/auth/user/${user_id}/update-status`,
                {
                    status: status,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            if (res.data.status) {
                fetchUsers()
                withReactContent(Swal).fire({
                    icon: 'success',
                    text: `User status updated successfully`,
                    confirmButtonText: "Ok",
                })
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const changeStatusAlert = (status, user_id, text) => {
        withReactContent(Swal).fire({
            icon: 'info',
            text: `Are you sure you want to ${text} this account?`,
            showDenyButton: true,
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                changeStatus(status, user_id)
            }
        })
    }



    return (
        <>
            <CommonHeader />
            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Role</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map(function (user) {
                                            return <tr key={user._id}>
                                                <td>{user.name || ""}</td>
                                                <td><a href={`mailto:${user.email || '-'}`}>{user.email || '-'}</a></td>
                                                <td>
                                                    <a href={`tel:${user.phone}`}>{user.phone}</a>
                                                </td>
                                                <td className='text-capitalize'>
                                                    {user.userRole?.replace('_', " ") || ""}
                                                </td>
                                                <td className='text-capitalize'>
                                                    {statuses[user.status]}
                                                </td>
                                                <td className="text-right">
                                                    {
                                                        user.status == "1" || user.status == "0" || user.status == "3" ? <UncontrolledDropdown>
                                                            <DropdownToggle
                                                                className="btn-icon-only text-light"
                                                                href="#pablo"
                                                                role="button"
                                                                size="sm"
                                                                color=""
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                }}
                                                            >
                                                                <i className="fas fa-ellipsis-v" />
                                                            </DropdownToggle>
                                                            <DropdownMenu className="dropdown-menu-arrow" right>
                                                                <DropdownItem
                                                                    href="#pablo"
                                                                    onClick={(e) => {
                                                                        e.preventDefault()
                                                                        changeStatusAlert(user.status == 1 ? 0 : 1, user._id, user.status == "1" ? "de-activate" : (user.status == "3" ? "approve account" : "activate"))
                                                                    }}
                                                                >
                                                                    {user.status == "1" ? "Mark Inactive" : (user.status == "3" ? "Approve Account" : "Mark Active")}
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown> : ''
                                                    }
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </Table>
                            <CardFooter className="py-4">
                                <nav aria-label="...">
                                    <BuildPagination totalPages={totalPages} currentPage={currentPage} onClick={(page) => setCurrentPage(page)} />
                                </nav>
                            </CardFooter>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
}

export default Users