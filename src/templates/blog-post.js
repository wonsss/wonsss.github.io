import "./index.scss"

import React, { useEffect, useRef } from "react"
import { graphql } from "gatsby"

import * as Elements from "../components/elements"
import { Layout } from "../layout"
import { Container } from "../components/container"
import { Content } from "../components/content"
import { Head } from "../components/head"
import { PostTitle } from "../components/post-title"
import { PostDate } from "../components/post-date"
import { PostContainer } from "../components/post-container"
import { SocialShare } from "../components/social-share"
import { TableOfContents } from "../components/table-of-contents"
import { MobileTableOfContents } from "../components/mobile-table-of-contents"
import { FloatingButton } from "../components/floating-button"
import { SponsorButton } from "../components/sponsor-button"
import { Bio } from "../components/bio"
import { PostNavigator } from "../components/post-navigator"
import { Disqus } from "../components/disqus"
import { Search } from "../components/search"

import { Utterances } from "../components/utterances"
import * as ScrollManager from "../utils/scroll"
import { useScrollEvent } from "../hooks/useScrollEvent"
import * as EventManager from "../utils/event-manager"
import * as Dom from "../utils/dom"

import "../styles/code.scss"
import "katex/dist/katex.min.css"

const OFFSET = 10

export default ({ data, pageContext, location }) => {
	useEffect(() => {
		ScrollManager.init()
		return () => ScrollManager.destroy()
	}, [])

	const post = data.markdownRemark
	const posts = data.allMarkdownRemark.edges

	const metaData = data.site.siteMetadata
	const { title, comment, siteUrl, author, sponsor } = metaData
	const { disqusShortName, utterances } = comment
	const { title: postTitle, date } = post.frontmatter
	const slug = pageContext.slug

	const headerElements = useRef()
	useEffect(() => {
		function getHeaderElements() {
			const headerElements = Dom.getElements("h1, h2, h3, h4, h5")
			return Array.from(headerElements)
		}

		headerElements.current = getHeaderElements()
	}, [])

	// TableOfContents
	const onScroll = () => {
		const currentoffsetY = window.pageYOffset
		const tocLinkElements = Dom.getElements(`a[href*="${encodeURI(slug)}"]`)

		for (const [index, headerElement] of headerElements.current.entries()) {
			const { top } = headerElement.getBoundingClientRect()
			const elementTop = top + currentoffsetY

			if (!tocLinkElements[index - 1]) {
				continue
			}

			if (currentoffsetY >= elementTop - OFFSET) {
				headerElement.classList.add("toc-header-active")
				tocLinkElements[index - 1].classList.add("toc-active")
			} else {
				headerElement.classList.remove("toc-header-active")
				tocLinkElements[index - 1].classList.remove("toc-active")
			}
		}
	}

	useScrollEvent(() => {
		return EventManager.toFit(onScroll, {})()
	})

	useEffect(() => {
		const mobileTableOfContent = Dom.getElement(".mobile-table-of-content")

		if (mobileTableOfContent && window.innerWidth > 1024) {
			mobileTableOfContent.remove()
		}
	}, [])

	return (
		<Layout location={location} title={title}>
			<Container>
				<Content>
					<Search posts={posts} />

					<Head title={postTitle} description={post.excerpt} />
					<PostTitle title={postTitle} />
					<PostDate date={date} />
					<MobileTableOfContents content={post.tableOfContents} />
					<PostContainer html={post.html} />
					<SocialShare title={postTitle} author={author} />
					{!!sponsor.buyMeACoffeeId && (
						<SponsorButton sponsorId={sponsor.buyMeACoffeeId} />
					)}
					<Elements.Hr />
					<Bio />
					<PostNavigator pageContext={pageContext} />
					{!!disqusShortName && (
						<Disqus
							post={post}
							shortName={disqusShortName}
							siteUrl={siteUrl}
							slug={pageContext.slug}
						/>
					)}
					{!!utterances && <Utterances repo={utterances} />}
				</Content>
				<FloatingButton />

				<TableOfContents content={post.tableOfContents} />
			</Container>
		</Layout>
	)
}

export const pageQuery = graphql`
	query BlogPostBySlug($slug: String!) {
		site {
			siteMetadata {
				title
				author
				siteUrl
				comment {
					disqusShortName
					utterances
				}
				sponsor {
					buyMeACoffeeId
				}
			}
		}
		markdownRemark(fields: { slug: { eq: $slug } }) {
			id
			excerpt(pruneLength: 280)
			html
			frontmatter {
				title
				date(formatString: "MMMM DD, YYYY")
			}
			tableOfContents
		}
		allMarkdownRemark(
			sort: { fields: [frontmatter___date], order: DESC }
			filter: { frontmatter: { category: { ne: null }, draft: { eq: false } } }
		) {
			edges {
				node {
					excerpt(pruneLength: 200, truncate: true)
					fields {
						slug
					}
					frontmatter {
						date(formatString: "MMMM DD, YYYY")
						title
						category
						draft
					}
					headings {
						value
					}
				}
			}
		}
	}
`
