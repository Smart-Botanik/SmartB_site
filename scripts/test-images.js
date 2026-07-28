const http = require('http');

async function testImages() {
  const url = 'http://localhost:3030/';
  console.log(`Fetching main page from ${url}...`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    console.log('Successfully retrieved HTML. Parsing image sources...');

    // Regex to match src="..." and srcset="..."
    const srcRegex = /(?:src|srcset)="([^"]+)"/g;
    const urls = [];
    let match;

    while ((match = srcRegex.exec(html)) !== null) {
      const matchedUrl = match[1];
      // Normalize NextJS image optimization URLs if any (e.g. /_next/image?url=URL&w=...)
      if (matchedUrl.includes('_next/image')) {
        const urlParam = new URL(matchedUrl, 'http://localhost:3030').searchParams.get('url');
        if (urlParam) {
          urls.push(urlParam);
        }
      }
      urls.push(matchedUrl);
    }

    // Filter unique URLs
    const uniqueUrls = [...new Set(urls)].filter(u => u.includes('uploads') || u.includes('3001') || u.includes('192.168.1.12'));

    console.log(`\nFound ${uniqueUrls.length} relevant image reference(s) on the main page:`);
    let hasError = false;
    let hasUploads = false;

    for (const imgUrl of uniqueUrls) {
      const isLocalhost3001 = imgUrl.includes('localhost:3001/uploads') || imgUrl.includes('localhost:3001');
      if (imgUrl.includes('uploads')) {
        hasUploads = true;
      }
      
      if (isLocalhost3001) {
        console.log(`❌ FAIL: ${imgUrl} (points to localhost:3001)`);
        hasError = true;
      } else if (imgUrl.includes('192.168.1.12:3000/uploads')) {
        console.log(`✅ PASS: ${imgUrl} (points to static host 192.168.1.12:3000)`);
      } else if (imgUrl.includes('192.168.1.12:3001/uploads')) {
        console.log(`❌ FAIL: ${imgUrl} (points to wrong port 3001)`);
        hasError = true;
      } else {
        console.log(`ℹ️ INFO: ${imgUrl}`);
      }
    }

    if (hasError) {
      console.log('\n❌ TEST FAILED: One or more image URLs point to localhost:3001.');
      process.exit(1);
    } else {
      console.log('\n✅ TEST PASSED: No image URLs point to localhost:3001.');
      if (!hasUploads) {
        console.log('ℹ️ Note: No upload images were detected on the page. Ensure the backend database contains images/data.');
      }
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error running test:', error.message);
    process.exit(1);
  }
}

testImages();
