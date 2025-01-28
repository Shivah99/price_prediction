import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>
          <img src="https://img.icons8.com/ios-filled/50/000000/book.png" alt="Book Icon" />
          My Book Library
        </h1>
      </header>

      <div id="about" className="about-section common-div">
        <h2>About this Page 👇</h2>
        <p>Hello! I’m Shivaji Burgula. This web page is to test Flexbox and Grid layouts.</p>
      </div>

      <div id="book-list" className="book-list-section common-div">
        <h2>The Book 📚 (Grid Layout)</h2>
        <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(3, auto)', gap: '10px', alignContent: 'start', justifyContent: 'center' }}>
          <div className="grid-item book1" style={{ gridArea: '1 / 1 / 2 / 2', justifySelf: 'center', alignSelf: 'start' }}>
            <img src="https://m.media-amazon.com/images/I/91bUfxdDjWL._SY466_.jpg" alt="Harry Potter and the Cursed Child" />
            <p>Harry Potter and the Cursed Child</p>
          </div>
          <div className="grid-item book2" style={{ gridArea: '1 / 2 / 2 / 3', justifySelf: 'end', alignSelf: 'center' }}>
            <img src="https://static0.colliderimages.com/wordpress/wp-content/uploads/2016/07/the-lord-of-the-rings-book-cover.jpg" alt="The Lord of the Rings" />
            <p>The Lord of the Rings</p>
          </div>
          <div className="grid-item book3" style={{ gridArea: '2 / 1 / 3 / 2', justifySelf: 'start', alignSelf: 'end' }}>
            <img src="https://w7.pngwing.com/pngs/566/536/png-transparent-to-kill-a-mockingbird-atticus-finch-monroeville-book-cover-jem-finch-book-thumbnail.png" alt="To Kill a Mockingbird" />
            <p>To Kill a Mockingbird</p>
          </div>
          <div className="grid-item book4" style={{ gridArea: '2 / 2 / 3 / 3', justifySelf: 'center', alignSelf: 'stretch' }}>
            <img src="https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg" alt="1984" />
            <p>1984</p>
          </div>
          <div className="grid-item book5" style={{ gridColumn: '1 / -1', gridRow: '3 / 4', height: '300px' }}>
            <img src="https://images-na.ssl-images-amazon.com/images/I/91uwocAMtSL.jpg" alt="The promised land" />
            <p>The Promised Land</p>
          </div>
        </div>
      </div>

      <div id="flexbox-demo" className="flexbox-demo-section common-div">
        <h2>Book Authors ✍🏼 (Flexbox Layout)</h2>
        <div className="flex-container" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', alignContent: 'space-between' }}>
          <div className="flex-item book1" style={{ flex: '2 1 250px', order: '3', alignSelf: 'flex-start' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5d/J._K._Rowling_2010.jpg" alt="J.K. Rowling" />
            <p>J.K. Rowling</p>
          </div>
          <div className="flex-item book2" style={{ flex: '1 2 200px', order: '1', alignSelf: 'center' }}>
            <img src="https://cdn.britannica.com/65/66765-050-63A945A7/JRR-Tolkien.jpg" alt="J.R.R. Tolkien" />
            <p>J.R.R. Tolkien</p>
          </div>
          <div className="flex-item book3" style={{ flex: '3 1 150px', order: '5', alignSelf: 'flex-end' }}>
            <img src="https://tse1.mm.bing.net/th?id=OIP.JeD6SynDkmcng6pc8bZDGQHaHa" alt="Harper Lee" />
            <p>Harper Lee</p>
          </div>
          <div className="flex-item book4" style={{ flex: '1 1 300px', order: '2', alignSelf: 'stretch' }}>
            <img src="https://m.media-amazon.com/images/I/71pYJOumMlL._SY466_.jpg" alt="George Orwell" />
            <p>George Orwell</p>
          </div>
          <div className="flex-item book5" style={{ flex: '2 2 200px', order: '4', alignSelf: 'center' }}>
            <img src="https://m.media-amazon.com/images/I/51I1Hl9m6eL._SY466_.jpg" alt="Barack Obama" />
            <p>Barack Obama</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© Shivaji Burgula</p>
      </footer>
    </div>
  );
}

export default App;
