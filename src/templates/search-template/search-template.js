import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import SEO from "../../components/seo"
import Layout from '../../containers/layout/layout'
import Header from '../../containers/layout/header/header-three'
import Footer from '../../containers/layout/footer/footer-one'
import PageHeader from '../../components/pageheader'
import { Container, Row, Col } from '../../components/ui/wrapper'
import Heading from '../../components/ui/heading'
import Sidebar from '../../containers/blog/sidebar'
import CTA from '../../containers/global/cta-area/section-one'
import Blog from '../../components/blog/layout-two'
import { BlogListWrapper, BlogBoxWrapper, BlogBox, SearchInfoHeader, SearchError } from './search-template.style'

const SearchTemplate = ({ data, pageContext, location, ...restProps }) => {
    const { headingStyle } = restProps;
    const blogs = data.allMarkdownRemark.edges || [];
    const { state } = location;
    const query = state && state.query
    let filteredBlogs = [];
    if (state) {
        filteredBlogs = blogs.filter(post => {
            const { title, quote_text, quote_author, categories, tags } = post.node.frontmatter
            const { html } = post.node

            return (
                (title && title.toLowerCase().includes(query)) ||
                (quote_text && quote_text.toLowerCase().includes(query)) ||
                (quote_author && quote_author.toLowerCase().includes(query)) ||
                (html && html.toLowerCase().includes(query)) ||
                // (authorName && authorName.toLowerCase().includes(query)) ||
                (tags &&
                    tags
                        .join("")
                        .toLowerCase()
                        .includes(query.toLowerCase())) ||
                (categories &&
                    categories
                        .join("")
                        .toLowerCase()
                        .includes(query.toLowerCase()))
            )
        });
    }

    return (
        <Layout location={location}>
            <SEO title={`Search`} />
            <Header />
            <PageHeader
                pageContext={pageContext}
                location={location}
                title={`Search`}
            />
            <main className="site-wrapper-reveal">
                <BlogListWrapper>
                    <Container>
                        <Row>
                            {/* <Col lg={{ span: 4, order: 1 }} xs={{ span: 12, order: 2 }}>
                                <Sidebar />
                            </Col> */}
                            <Col lg={12} xs={12}>
                                {filteredBlogs && (
                                    <SearchInfoHeader>
                                        <Heading {...headingStyle}>Search for: <span>{query}</span></Heading>
                                        <Heading as="h5">Posts Found: {filteredBlogs.length}</Heading>
                                    </SearchInfoHeader>
                                )}
                                {filteredBlogs.length > 0 && (
                                    <BlogBoxWrapper>
                                        {filteredBlogs.map(blog => (
                                            <BlogBox key={blog.node.fields.slug}>
                                                <Blog content={blog.node} />
                                            </BlogBox>
                                        ))}
                                    </BlogBoxWrapper>
                                )}
                                {filteredBlogs.length === 0 && (
                                    <SearchError>
                                        <h2>Nothing Found</h2>
                                    </SearchError>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </BlogListWrapper>
                {/* <CTA /> */}
            </main>
            <Footer />
        </Layout>
    )
}

export const query = graphql`
    query BlogBySearchQuery{
        allMarkdownRemark(
            sort: {fields: frontmatter___date, order: DESC}
        ) {
            edges {
                node {
                    frontmatter {
                        title
                        categories
                        date(formatString: "LL")
                        tags
                        type
                        video_link
                        quote_text
                        quote_author
                        format
                        date(formatString: "LL")
                    }
                    fields {
                        slug
                        authorId
                        dateSlug
                    }
                    excerpt
                    html
                }
            }
        }
    }
`;


SearchTemplate.propTypes = {
    headingStyle: PropTypes.object
}

SearchTemplate.defaultProps = {
    headingStyle: {
        as: 'h3',
        child: {
            color: 'primary'
        }
    }
}
export default SearchTemplate;