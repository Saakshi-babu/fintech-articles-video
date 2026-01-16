from duckduckgo_search import DDGS
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

def get_real_recommendations(topic):
    """
    Fetches real search results for articles and videos using DuckDuckGo.
    Returns a dictionary with 'articles' and 'videos'.
    """
    results = {
        "articles": [],
        "videos": []
    }
    
    try:
        with DDGS() as ddgs:
            # 1. Fetch Articles
            # STRATEGY: Strict Domain Whitelist. 
            # We iterate through trusted Indian sites. The first one to yield results wins.
            # This guarantees the content is Indian and Financial.
            trusted_domains = [
                "site:cleartax.in", 
                "site:bankbazaar.com", 
                "site:groww.in",
                "site:paisabazaar.com",
                "site:economictimes.indiatimes.com"
            ]
            
            found_articles = []
            
            for domain in trusted_domains:
                if len(found_articles) >= 3:
                    break
                    
                logging.info(f"Scraping {domain} for: {topic}")
                # Query: "site:cleartax.in Apply for PAN Card"
                query = f"{domain} {topic}"
                
                # We can relax the region check slightly since the domain itself implies the region/language,
                # but valid 'in-en' doesn't hurt.
                site_results = list(ddgs.text(query, region='in-en', max_results=3))
                
                for res in site_results:
                    # Basic deduplication based on URL
                    if not any(a['url'] == res.get('href') for a in found_articles):
                         found_articles.append({
                            "title": res.get('title', 'Article'),
                            "url": res.get('href', '#')
                        })
            
            results["articles"] = found_articles[:3]

            # 2. Fetch Videos (YouTube is generally reliable with 'India' keyword)
            video_query = f"{topic} tutorial India"
            video_results = list(ddgs.videos(video_query, region='in-en', max_results=3))
            
            for res in video_results:
                results["videos"].append({
                    "title": res.get('title', 'Video'),
                    "url": res.get('content', '#') 
                })
                
    except Exception as e:
        logging.error(f"Scraping Error: {e}")
        return {"error": str(e)}

    return results

if __name__ == "__main__":
    # Test
    print(get_real_recommendations("Apply for PAN Card Submit"))
