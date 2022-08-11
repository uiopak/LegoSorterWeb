// <auto-generated>
//     Generated by the protocol buffer compiler.  DO NOT EDIT!
//     source: proto/LegoAnalysisFast.proto
// </auto-generated>
#pragma warning disable 0414, 1591, 8981
#region Designer generated code

using grpc = global::Grpc.Core;

namespace LegoSorterWeb.proto {
  public static partial class LegoAnalysisFast
  {
    static readonly string __ServiceName = "analysis.LegoAnalysisFast";

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static void __Helper_SerializeMessage(global::Google.Protobuf.IMessage message, grpc::SerializationContext context)
    {
      #if !GRPC_DISABLE_PROTOBUF_BUFFER_SERIALIZATION
      if (message is global::Google.Protobuf.IBufferMessage)
      {
        context.SetPayloadLength(message.CalculateSize());
        global::Google.Protobuf.MessageExtensions.WriteTo(message, context.GetBufferWriter());
        context.Complete();
        return;
      }
      #endif
      context.Complete(global::Google.Protobuf.MessageExtensions.ToByteArray(message));
    }

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static class __Helper_MessageCache<T>
    {
      public static readonly bool IsBufferMessage = global::System.Reflection.IntrospectionExtensions.GetTypeInfo(typeof(global::Google.Protobuf.IBufferMessage)).IsAssignableFrom(typeof(T));
    }

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static T __Helper_DeserializeMessage<T>(grpc::DeserializationContext context, global::Google.Protobuf.MessageParser<T> parser) where T : global::Google.Protobuf.IMessage<T>
    {
      #if !GRPC_DISABLE_PROTOBUF_BUFFER_SERIALIZATION
      if (__Helper_MessageCache<T>.IsBufferMessage)
      {
        return parser.ParseFrom(context.PayloadAsReadOnlySequence());
      }
      #endif
      return parser.ParseFrom(context.PayloadAsNewBuffer());
    }

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::LegoSorterWeb.proto.ImageRequest> __Marshaller_common_ImageRequest = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::LegoSorterWeb.proto.ImageRequest.Parser));
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::LegoSorterWeb.proto.ListOfBoundingBoxes> __Marshaller_common_ListOfBoundingBoxes = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::LegoSorterWeb.proto.ListOfBoundingBoxes.Parser));

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Method<global::LegoSorterWeb.proto.ImageRequest, global::LegoSorterWeb.proto.ListOfBoundingBoxes> __Method_DetectBricks = new grpc::Method<global::LegoSorterWeb.proto.ImageRequest, global::LegoSorterWeb.proto.ListOfBoundingBoxes>(
        grpc::MethodType.Unary,
        __ServiceName,
        "DetectBricks",
        __Marshaller_common_ImageRequest,
        __Marshaller_common_ListOfBoundingBoxes);

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Method<global::LegoSorterWeb.proto.ImageRequest, global::LegoSorterWeb.proto.ListOfBoundingBoxes> __Method_DetectAndClassifyBricks = new grpc::Method<global::LegoSorterWeb.proto.ImageRequest, global::LegoSorterWeb.proto.ListOfBoundingBoxes>(
        grpc::MethodType.Unary,
        __ServiceName,
        "DetectAndClassifyBricks",
        __Marshaller_common_ImageRequest,
        __Marshaller_common_ListOfBoundingBoxes);

    /// <summary>Service descriptor</summary>
    public static global::Google.Protobuf.Reflection.ServiceDescriptor Descriptor
    {
      get { return global::LegoSorterWeb.proto.LegoAnalysisFastReflection.Descriptor.Services[0]; }
    }

    /// <summary>Client for LegoAnalysisFast</summary>
    public partial class LegoAnalysisFastClient : grpc::ClientBase<LegoAnalysisFastClient>
    {
      /// <summary>Creates a new client for LegoAnalysisFast</summary>
      /// <param name="channel">The channel to use to make remote calls.</param>
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public LegoAnalysisFastClient(grpc::ChannelBase channel) : base(channel)
      {
      }
      /// <summary>Creates a new client for LegoAnalysisFast that uses a custom <c>CallInvoker</c>.</summary>
      /// <param name="callInvoker">The callInvoker to use to make remote calls.</param>
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public LegoAnalysisFastClient(grpc::CallInvoker callInvoker) : base(callInvoker)
      {
      }
      /// <summary>Protected parameterless constructor to allow creation of test doubles.</summary>
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      protected LegoAnalysisFastClient() : base()
      {
      }
      /// <summary>Protected constructor to allow creation of configured clients.</summary>
      /// <param name="configuration">The client configuration.</param>
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      protected LegoAnalysisFastClient(ClientBaseConfiguration configuration) : base(configuration)
      {
      }

      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual global::LegoSorterWeb.proto.ListOfBoundingBoxes DetectBricks(global::LegoSorterWeb.proto.ImageRequest request, grpc::Metadata headers = null, global::System.DateTime? deadline = null, global::System.Threading.CancellationToken cancellationToken = default(global::System.Threading.CancellationToken))
      {
        return DetectBricks(request, new grpc::CallOptions(headers, deadline, cancellationToken));
      }
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual global::LegoSorterWeb.proto.ListOfBoundingBoxes DetectBricks(global::LegoSorterWeb.proto.ImageRequest request, grpc::CallOptions options)
      {
        return CallInvoker.BlockingUnaryCall(__Method_DetectBricks, null, options, request);
      }
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual grpc::AsyncUnaryCall<global::LegoSorterWeb.proto.ListOfBoundingBoxes> DetectBricksAsync(global::LegoSorterWeb.proto.ImageRequest request, grpc::Metadata headers = null, global::System.DateTime? deadline = null, global::System.Threading.CancellationToken cancellationToken = default(global::System.Threading.CancellationToken))
      {
        return DetectBricksAsync(request, new grpc::CallOptions(headers, deadline, cancellationToken));
      }
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual grpc::AsyncUnaryCall<global::LegoSorterWeb.proto.ListOfBoundingBoxes> DetectBricksAsync(global::LegoSorterWeb.proto.ImageRequest request, grpc::CallOptions options)
      {
        return CallInvoker.AsyncUnaryCall(__Method_DetectBricks, null, options, request);
      }
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual global::LegoSorterWeb.proto.ListOfBoundingBoxes DetectAndClassifyBricks(global::LegoSorterWeb.proto.ImageRequest request, grpc::Metadata headers = null, global::System.DateTime? deadline = null, global::System.Threading.CancellationToken cancellationToken = default(global::System.Threading.CancellationToken))
      {
        return DetectAndClassifyBricks(request, new grpc::CallOptions(headers, deadline, cancellationToken));
      }
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual global::LegoSorterWeb.proto.ListOfBoundingBoxes DetectAndClassifyBricks(global::LegoSorterWeb.proto.ImageRequest request, grpc::CallOptions options)
      {
        return CallInvoker.BlockingUnaryCall(__Method_DetectAndClassifyBricks, null, options, request);
      }
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual grpc::AsyncUnaryCall<global::LegoSorterWeb.proto.ListOfBoundingBoxes> DetectAndClassifyBricksAsync(global::LegoSorterWeb.proto.ImageRequest request, grpc::Metadata headers = null, global::System.DateTime? deadline = null, global::System.Threading.CancellationToken cancellationToken = default(global::System.Threading.CancellationToken))
      {
        return DetectAndClassifyBricksAsync(request, new grpc::CallOptions(headers, deadline, cancellationToken));
      }
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual grpc::AsyncUnaryCall<global::LegoSorterWeb.proto.ListOfBoundingBoxes> DetectAndClassifyBricksAsync(global::LegoSorterWeb.proto.ImageRequest request, grpc::CallOptions options)
      {
        return CallInvoker.AsyncUnaryCall(__Method_DetectAndClassifyBricks, null, options, request);
      }
      /// <summary>Creates a new instance of client from given <c>ClientBaseConfiguration</c>.</summary>
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      protected override LegoAnalysisFastClient NewInstance(ClientBaseConfiguration configuration)
      {
        return new LegoAnalysisFastClient(configuration);
      }
    }

  }
}
#endregion
