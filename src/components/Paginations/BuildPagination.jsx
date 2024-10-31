import React from 'react'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'

const BuildPagination = ({ totalPages = 1, currentPage = 1, onClick }) => {
    let pages = [];

    for (let index = 1; index <= totalPages; index++) {
        pages.push(
            <PaginationItem key={index} active={index === currentPage}>
                <PaginationLink
                    href="#pablo"
                    onClick={(e) => onClick(index)}
                    tabIndex="-1"
                >
                    {index}
                </PaginationLink>
            </PaginationItem>
        )
    }

    return (
        <Pagination
            className="pagination justify-content-end mb-0"
            listClassName="justify-content-end mb-0"
        >
            <PaginationItem disabled={currentPage === 1} >
                <PaginationLink
                    href="#pablo"
                    onClick={(e) => onClick(currentPage - 1)}
                    tabIndex="-1"
                >
                    <i className="fas fa-angle-left" />
                    <span className="sr-only">Previous</span>
                </PaginationLink>
            </PaginationItem>
            {pages.map(page => page)}
            <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink
                    href="#pablo"
                    onClick={(e) => onClick(currentPage + 1)}
                >
                    <i className="fas fa-angle-right" />
                    <span className="sr-only">Next</span>
                </PaginationLink>
            </PaginationItem>
        </Pagination>
    )
}

export default BuildPagination