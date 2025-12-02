import ViewModal from "@/components/ViewModal";

export default function RulesModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <ViewModal
      open={open}
      onClose={onClose}
      title="《Pre-sale rules》"
      closeTitle="I know"
      children={
        <div className="custom-scroll  text-base-white text-xs m-2 overflow-auto max-h-[40vh] break-all">
          <p>
            <strong>
              In order to protect the legitimate rights and interests of users
              participating in the pre-sale and maintain the normal operating
              order of the pre-sale, these rules are formulated in accordance
              with relevant agreements and laws and regulations.
            </strong>
          </p>
          <br />
          <p>
            <strong>Country Chapter 1 Definition</strong>
          </p>
          <br />
          <p>
            <strong>
              1.1 Pre-sale definition: refers to a sales model in which a seller
              offers a bundle of a product or service, collects
            </strong>
          </p>
          <br />
          <p>
            <strong>
              consumer orders through product tools before selling, and makes it
              available to customers. consumers of goods and/o
            </strong>
          </p>
          <br />
          <p>
            <strong>services by prior agreement.</strong>
          </p>
          <br />
          <p>
            <strong>
              1.2 Presale mode is "deposit" mode. "Consignment" refers to the
              pre-delivery of a fixed number of items prior to sale.
            </strong>
          </p>
          <br />
          <p>
            <br />
            <strong>
              "Deposit" Scam Join mini games for a chance to win more deposits.
              Deposits can be exchanged directly for goods. Deposit is not
              refundable.
            </strong>
          </p>
          <p>
            <strong>
              1.3 Pre-sale product: A product that is shipped by the seller
              using the pre-sale product tool. Only highlight the word presale
              on the product name or product detail page, and products that do
              not use the presale product tool are not presale.
            </strong>
          </p>
          <p>
            <br />
            <strong>
              1.4 Pre-sale system: refers to the system product tool that helps
              sellers to sell samples before selling.
            </strong>
          </p>
          <p>
            <br />
            <strong>
              1.5 Product price before selling: is the selling price of the
              product before selling. The price of pre-sale items consists of
              two parts: deposit and final payment.
            </strong>
          </p>
        </div>
      }
    />
  );
}
