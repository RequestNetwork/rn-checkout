import { Playground } from "@/components/Playground";

export const metadata = {
  title: "Request Checkout Playground",
  description:
    "A playground for the Request Checkout widget. You can experiment with the widget's properties, such as seller information, product details, and supported currencies.",
};

export default function PlaygroundPage() {
  return (
    <>
      <h1 className="font-bold text-4xl mb-4">Request Checkout Playground</h1>

      <div className="flex flex-col gap-2">
        <p>
          Request Checkout is a pre-built component that abstracts all the
          complexities of blockchain transactions using Request Network, making
          it simple for businesses to handle crypto-to-crypto payments without
          deep technical knowledge. It is open-source and free to integrate,
          designed for:
        </p>
        <ul className="list-disc list-inside">
          <li>
            E-commerce websites that want to accept crypto and receive crypto
          </li>
          <li>
            Businesses that want their payment tools to be customizable and
            fully controllable, and you can build on top of it
          </li>
          <li>
            Payments made within the widget are compatible with all other apps
            on the Request Network, so you can use the payment details inside
            other tools
          </li>
        </ul>

        <section className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl my-4">Playground</h2>
          <p>
            The playground on this page lets you experiment with the widget
            firsthand. You can enter different values for the widget's
            properties, such as seller information, product details, and
            supported currencies. As you adjust these settings, you'll see how
            the widget responds in real time. This interactive experience helps
            you understand how the widget works and how it might look and
            function on your own website.
          </p>
          <p>
            Try different configurations to see how versatile and user-friendly
            the Request Checkout payment widget can be for your customers!
          </p>
          <Playground />
        </section>
      </div>
    </>
  );
}
