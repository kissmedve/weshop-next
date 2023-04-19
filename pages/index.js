import Image from "next/image";
import cartlistItemClickAmounts from "../public/images/cartlist_itemclick_amounts.png";
import cartlistPdf from "../public/images/cartlist_pdf.png";
import cartlistTotalsCircle from "../public/images/cartlist_totals_circle.png";
import editTags from "../public/images/edit-tags.png";
import importUrlsJson from "../public/images/import-urls_json.png";
import listProductsClickthrough from "../public/images/list_products_clickthrough.png";
import listProducts from "../public/images/list_products.png";
import peopleShopping from "../public/images/people-shopping.svg";

function LandingPage() {
  return (
    <>
      <div className="container index">
        <section className="section hero">
          <div className="columns">
            <div className="column illustration is-6">
              <Image
                src={peopleShopping}
                className="img-responsive"
                alt="People shopping groceries"
              />
            </div>

            <div className="statement is-6 column">
              <h1 className="title">WeShop</h1>
              <p>Shop all your groceries from the comfort of your home.</p>
              <p>
                Pool orders with roommates or neighbours and save on delivery
                fees. Even include those without access to the internet.
              </p>
              <p>
                Also helpful, if you need to assist residents of a group home
                facility with personal shopping and/or limit their choice of
                products.
              </p>
            </div>
          </div>
        </section>

        <h2 className="title front">How does it work?</h2>

        <section className="section main">
          <div className="columns">
            <div className="column statement is-6">
              <h3 className="title green">Import Product Links</h3>
              <p>
                Bookmark everyone's preferred products, collect the links in a
                json file and import the product data into your database.
              </p>
            </div>
            <div className="column illustration is-6">
              <Image
                src={importUrlsJson}
                className="img-responsive"
                alt="Import URLs"
              />
            </div>
          </div>
          <hr />
          <div className="columns">
            <div className="column illustration is-6">
              <Image src={editTags} className="img-responsive" alt="Tagging" />
            </div>
            <div className="column statement is-6">
              <h3 className="title green">Tags</h3>
              <p>Categorize all products so that they can be filtered.</p>
              <p>Tag by product family, product range, and/or user.</p>
              <p>Shop tags are provided by the system.</p>
            </div>
          </div>
          <hr />
          <div className="columns">
            <div className="column statement is-6">
              <h3 className="title green">Printed Product Listing</h3>
              <p>
                Generate a product catalog, and distribute it in pdf format to
                all participants as an order reference - including those without
                access to the internet.
              </p>
              <p>Collect everyone's orders.</p>
            </div>
            <div className="column illustration is-6">
              <Image
                src={listProducts}
                className="img-responsive"
                alt="Product catalog"
              />
            </div>
          </div>
          <hr />
          <div className="columns">
            <div className="column illustration is-6">
              <Image
                src={listProductsClickthrough}
                className="img-responsive"
                alt="Article with links"
              />
            </div>
            <div className="column statement is-6">
              <h3 className="title green">Quick Ordering</h3>
              <p>
                Yes, you'll have to put in the joint order on the shop's website
                manually, but you can click through from every item of your
                catalog, nice and easy.
              </p>
            </div>
          </div>
          <hr />
          <div className="columns">
            <div className="column statement is-6">
              <h3 className="title green">Quick Listing</h3>
              <p>
                Upon delivery, collect all products into a "cart list" with a
                simple click each, and enter the respective amounts per user.
              </p>
            </div>
            <div className="column illustration is-6">
              <Image
                src={cartlistItemClickAmounts}
                className="img-responsive"
                alt="Cart list line items"
              />
            </div>
          </div>
          <hr />
          <div className="columns">
            <div className="column illustration is-6">
              <Image
                src={cartlistTotalsCircle}
                className="img-responsive"
                alt="Cart list with totals"
              />
            </div>
            <div className="column statement is-6">
              <h3 className="title green">Settlement Made Easy</h3>
              <p>No cumbersome calculations required.</p>
              <p>
                The tool will spit out all subtotals and the total cost for each
                party.
              </p>
            </div>
          </div>
          <hr />
          <div className="columns">
            <div className="column statement is-6">
              <h3 className="title green">Nice and Clean Invoice</h3>
              <p>Print out the listing for your records.</p>
            </div>
            <div className="column illustration is-6">
              <Image
                src={cartlistPdf}
                className="img-responsive"
                alt="Cartlist in print format"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default LandingPage;
